const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Message = require("../Models/Message");
const Chat = require("../Models/Chat");
const User = require("../Models/User");

const sendMessage = async (req, res) => {
  const { content, chatId, sender } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: sender,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "firstName lastName image");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName lastName image email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json({ message: message });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "firstName lastName image email")
      .populate("chat");
    res.json({ messages: messages });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
exports.sendMessage = sendMessage;
exports.allMessages = allMessages;
