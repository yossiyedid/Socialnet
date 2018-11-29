const HttpStatus = require("http-status-codes");
const cloudinary = require("cloudinary");
const moment = require("moment");
const request = require("request");

cloudinary.config({
  cloud_name: "mymessageimages",
  api_key: "819225954293853",
  api_secret: "xlpw7rouF0PKsjrOhNzmyD_JE6g"
});

const Joi = require("joi");
const Post = require("../models/postsModels");
const User = require("../models/userModels");

module.exports = {
  AddPost(req, res) {
    const schema = Joi.object().keys({
      post: Joi.string().required()
    });
    const body = {
      post: req.body.post
    };
    const { error } = Joi.validate(body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }
    const bodyObj = {
      user: req.user._id,
      username: req.user.username,
      post: req.body.post,
      created: new Date()
    };

    if (req.body.post && !req.body.image) {
      Post.create(bodyObj)
        .then(async post => {
          await User.updateOne(
            {
              _id: req.user._id
            },
            {
              $push: {
                posts: {
                  postId: post._id,
                  post: req.body.post,
                  created: new Date()
                }
              }
            }
          );
          res.status(HttpStatus.OK).json({ message: "Post created", post });
        })
        .catch(err => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Error occured" });
        });
    }

    if (req.body.post && req.body.image) {
      cloudinary.uploader.upload(req.body.image, async result => {
        const reqBody = {
          user: req.user._id,
          username: req.user.username,
          post: req.body.post,
          imgId: result.public_id,
          imgVersion: result.version,
          created: new Date()
        };
        Post.create(reqBody)
          .then(async post => {
            await User.updateOne(
              {
                _id: req.user._id
              },
              {
                $push: {
                  posts: {
                    postId: post._id,
                    post: req.body.post,
                    created: new Date()
                  }
                }
              }
            );
            res.status(HttpStatus.OK).json({ message: "Post created", post });
          })
          .catch(err => {
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: "Error occured" });
          });
      });
    }
  },

  async GetAllPosts(req, res) {
    try {
      // const today = moment().startOf('day');
      // const tomorrow = moment(today).add(1, 'days');

      const top = await Post.find({ totalLikes: { $gte: 2 } })
        .populate("user")
        .sort({ created: -1 });

      const posts = await Post.find({})
        .populate("user")
        .sort({ created: -1 });

      const user = await User.findOne({ _id: req.user._id });
      if (user.city === "" && user.country === "") {
        request(
          "https://geoip-db.com/json/",
          { json: true },
          async (err, res, body) => {
            await User.updateOne(
              {
                _id: req.user._id
              },
              {
                city: body.city,
                country: body.country_name
              }
            );
          }
        );
      }

      return res
        .status(HttpStatus.OK)
        .json({ message: "All posts", posts, top });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occurred" });
    }
  },

  async AddLike(req, res) {
    const postId = req.body._id;
    await Post.updateOne(
      {
        _id: postId,
        "likes.username": { $ne: req.user.username }
      },
      {
        $push: {
          likes: {
            username: req.user.username
          }
        },
        $inc: { totalLikes: 1 }
      }
    )
      .then(() => {
        res.status(HttpStatus.OK).json({ message: "You liked the post" });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occurred" });
      });
  },

  async AddComment(req, res) {
    const postId = req.body.postId;
    await Post.updateOne(
      {
        _id: postId
      },
      {
        $push: {
          comments: {
            userId: req.user._id,
            username: req.user.username,
            comment: req.body.comment,
            createdAt: new Date()
          }
        }
      }
    )
      .then(() => {
        res.status(HttpStatus.OK).json({ message: "Comment added to post" });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occurred" });
      });
  },

  async GetPost(req, res) {
    await Post.findOne({ _id: req.params.id })
      .populate("user")
      .populate("comments.userId")
      .then(post => {
        res.status(HttpStatus.OK).json({ message: "Post found", post });
      })
      .catch(err =>
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "Post not found", post })
      );
  }
};
