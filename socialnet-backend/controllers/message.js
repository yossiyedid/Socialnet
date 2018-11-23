const HttpStatus = require("http-status-codes");

const Message = require("../models/messageModels");
const Conversation = require("../models/conversationModels");
const User = require("../models/userModels");
const Helper = require("../Helpers/helper");

module.exports = {
  async GetAllMessages(req, res) {
    const { sender_Id, reciver_Id } = req.params;
    const conversation = await Conversation.findOne({
      $or: [
        {
          $and: [
            { "participants.senderId": sender_Id },
            { "participants.reciverId": reciver_Id }
          ]
        },
        {
          $and: [
            { "participants.senderId": reciver_Id },
            { "participants.reciverId": sender_Id }
          ]
        }
      ]
    }).select("_id");

    if (conversation) {
      const messages = await Message.findOne({
        conversationId: conversation._id
      });
      res
        .status(HttpStatus.OK)
        .json({ message: "Messages returned", messages });
    }
  },

  SendMessage(req, res) {
    const { sender_Id, reciver_Id } = req.params;

    Conversation.find(
      {
        $or: [
          {
            participants: {
              $elemMatch: { senderId: sender_Id, reciverId: reciver_Id }
            }
          },
          {
            participants: {
              $elemMatch: { senderId: reciver_Id, reciverId: sender_Id }
            }
          }
        ]
      },
      async (err, result) => {
        if (result.length > 0) {
          const msg = await Message.findOne({ conversationId: result[0]._id });
          Helper.updateChatList(req, msg);
          await Message.updateOne(
            {
              conversationId: result[0]._id
            },
            {
              $push: {
                message: {
                  senderId: req.user._id,
                  reciverId: req.params.reciver_Id,
                  sendername: req.user.username,
                  recivername: req.body.reciverName,
                  body: req.body.message
                }
              }
            }
          )
            .then(() =>
              res
                .status(HttpStatus.OK)
                .json({ message: "Message sent successfully" })
            )
            .catch(err =>
              res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Error occurred" })
            );
        } else {
          const newConversation = new Conversation();
          newConversation.participants.push({
            senderId: req.user._id,
            reciverId: req.params.reciver_Id
          });

          const saveConversation = await newConversation.save();

          const newMessage = new Message();
          newMessage.conversationId = saveConversation._id;
          newMessage.sender = req.user.username;
          newMessage.reciver = req.body.reciverName;
          newMessage.message.push({
            senderId: req.user._id,
            reciverId: req.params.reciver_Id,
            sendername: req.user.username,
            recivername: req.body.reciverName,
            body: req.body.message
          });

          await User.updateOne(
            {
              _id: req.user._id
            },
            {
              $push: {
                chatList: {
                  $each: [
                    {
                      reciverId: req.params.reciver_Id,
                      msgId: newMessage._id
                    }
                  ],
                  $position: 0
                }
              }
            }
          );

          await User.updateOne(
            {
              _id: req.params.reciver_Id
            },
            {
              $push: {
                chatList: {
                  $each: [
                    {
                      reciverId: req.user._id,
                      msgId: newMessage._id
                    }
                  ],
                  $position: 0
                }
              }
            }
          );

          await newMessage
            .save()
            .then(() =>
              res.status(HttpStatus.OK).json({ message: "Message sent" })
            )
            .catch(err =>
              res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Error occurred" })
            );
        }
      }
    );
  },

  async MarkReciverMessages(req, res) {
    const { sender, reciver } = req.params;
    const msg = await Message.aggregate([
      { $unwind: "$message" },
      {
        $match: {
          $and: [
            { "message.sendername": reciver, "message.recivername": sender }
          ]
        }
      }
    ]);

    if (msg.length > 0) {
      try {
        msg.forEach(async value => {
          await Message.updateOne(
            {
              "message._id": value.message._id
            },
            { $set: { "message.$.isRead": true } }
          );
        });
        res.status(HttpStatus.OK).json({ message: "Messages maked as read" });
      } catch (err) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occurred" });
      }
    }
  },

  async MarkAllMessages(req, res) {
    const msg = await Message.aggregate([
      { $match: { "message.recivername": req.user.username } },
      { $unwind: "$message" }
      // ,
      // { $match: { "message.recivername": req.user.username } }
    ]);
    if (msg.length > 0) {
      try {
        msg.forEach(async value => {
          await Message.updateOne(
            {
              "message._id": value.message._id
            },
            { $set: { "message.$.isRead": true } }
          );
        });
        res
          .status(HttpStatus.OK)
          .json({ message: "All messages maked as read" });
      } catch (err) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occurred" });
      }
    }
  }
};
