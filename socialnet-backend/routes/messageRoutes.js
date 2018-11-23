const express = require("express");

const router = express.Router();

const MessageCtrl = require("../controllers/message");
const AuthHelper = require("../Helpers/AuthHelper");

router.get(
  "/chat-messages/:sender_Id/:reciver_Id",
  AuthHelper.VerifyToken,
  MessageCtrl.GetAllMessages
);

router.get(
  "/reciver-messages/:sender/:reciver",
  AuthHelper.VerifyToken,
  MessageCtrl.MarkReciverMessages
);

router.get(
    "/mark-all-messages",
    AuthHelper.VerifyToken,
    MessageCtrl.MarkAllMessages
);

router.post(
  "/chat-messages/:sender_Id/:reciver_Id",
  AuthHelper.VerifyToken,
  MessageCtrl.SendMessage
);

module.exports = router;
