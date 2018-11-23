const User = require("../models/userModels");

module.exports = {
  firstUpper: username => {
    const name = username.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
  },

  lowerCase: str => {
    return str.toLowerCase();
  },

  updateChatList: async (req, message) => {
    await User.updateOne(
      {
        _id: req.user._id
      },
      {
        $pull: {
          chatList: {
            reciverId: req.params.reciver_Id
          }
        }
      }
    );
    await User.updateOne(
      {
        _id: req.params.reciver_Id
      },
      {
        $pull: {
          chatList: {
            reciverId: req.user._id
          }
        }
      }
    );

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
                              msgId: message._id
                          }
                      ],
                      $position: 0
                  }
              }
          }
      );

      await User.updateOne(
          {
              _id: req.params.receiver_Id
          },
          {
              $push: {
                  chatList: {
                      $each: [
                          {
                              reciverId: req.user._id,
                              msgId: message._id
                          }
                      ],
                      $position: 0
                  }
              }
          }
      );
  }
};
