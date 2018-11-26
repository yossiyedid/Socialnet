const cloudinary = require("cloudinary");
const HttpStatus = require("http-status-codes");

const User = require("../models/userModels");

cloudinary.config({
  cloud_name: "mymessageimages",
  api_key: "819225954293853",
  api_secret: "xlpw7rouF0PKsjrOhNzmyD_JE6g"
});

module.exports = {
  UploadImage(req, res) {
    cloudinary.uploader.upload(req.body.image, async result => {
      console.log(result);

      await User.updateOne(
        {
          _id: req.user._id
        },
        {
          $push: {
            images: {
              imgId: result.public_id,
              imgVersion: result.version
            }
          }
        }
      )
        .then(() =>
          res
            .status(HttpStatus.OK)
            .json({ message: "Image uploaded successfully." })
        )
        .catch(() =>
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Error in uploading image" })
        );
    });
  },
  async SetDefaultImage(req, res) {
    const { imgId, imgVersion } = req.params;
    await User.updateOne(
      {
        _id: req.user._id
      },
      {
        picId: imgId,
        picVersion: imgVersion
      }
    )
      .then(() =>
        res
          .status(HttpStatus.OK)
          .json({ message: "default image set successfully." })
      )
      .catch(() =>
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occurred" })
      );
  }
};
