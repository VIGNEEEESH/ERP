const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Message = require("../Models/Message");
const Chat = require("../Models/Chat");
const User = require("../Models/User");
const accessChat = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please try again", 422);
    return next(error);
  }
  const { userId, loggedInUser } = req.body;

  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: loggedInUser } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "firstName lastName image email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [loggedInUser, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(fullChat);
      } catch (err) {
        console.log(err);
        const error = new HttpError(
          "Something went wrong while creating the chat, please try again",
          500
        );
        return next(error);
      }
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
};

const fetchChats = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please try again", 422);
    return next(error);
  }
  const { loggedInUser } = req.params;

  try {
    Chat.find({ users: { $elemMatch: { $eq: loggedInUser } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "firstName lastName image email",
        });
        res.status(200).json({ chats: results });
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
const createGroupChat = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs, please try again", 422);
    return next(error);
  }

  const { chatName, loggedInUser } = req.body;
  let users = req.body.users;

  // Parse users if it's a string
  if (typeof users === "string") {
    users = users.split(",");
  }

  // Check for invalid users format
  if (!Array.isArray(users)) {
    return res.status(400).send({ message: "Invalid users format" });
  }

  // Ensure the admin is included in the users array
  if (!users.includes(loggedInUser)) {
    users.push(loggedInUser);
  }

  if (!chatName || !users) {
    return res.status(400).send({ message: "All fields are required" });
  }

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  try {
    const groupChat = new Chat({
      chatName: chatName,
      users: users,
      isGroupChat: true,
      groupAdmin: loggedInUser,
    });
    await groupChat.save();

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    return next(error);
  }
};

const renameGroup = async (req, res, next) => {
  const { chatId, chatName } = req.body;
  console.log(chatName);
  // Validation to ensure both chatId and chatName are provided
  if (!chatId || !chatName) {
    return res
      .status(400)
      .json({ message: "Chat ID and Chat Name are required" });
  }

  try {
    // Find and update the chat name
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true } // This option returns the updated document
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    // Check if the chat was found and updated
    if (!updatedChat) {
      return res.status(404).json({ message: "Chat Not Found" });
    } else {
      return res.status(200).json({ updatedChat: updatedChat });
    }
  } catch (error) {
    // Handle any errors that occur
    return res.status(500).json({ message: error.message });
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId, requesterId } = req.body;

  try {
    // Find the chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    // Check if the requester is the group admin
    if (chat.groupAdmin.toString() !== requesterId) {
      return res
        .status(403)
        .json({ message: "Only the group admin can add users" });
    }

    // Add the user to the chat
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    res.json(added);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while adding the user to the group",
    });
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId, requesterId } = req.body;

  try {
    // Find the chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    // Check if the requester is the group admin
    if (chat.groupAdmin.toString() !== requesterId) {
      return res
        .status(403)
        .json({ message: "Only the group admin can remove users" });
    }

    // Remove the user from the chat
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    res.json(removed);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while removing the user from the group",
    });
  }
};

exports.accessChat = accessChat;
exports.fetchChats = fetchChats;
exports.createGroupChat = createGroupChat;
exports.renameGroup = renameGroup;
exports.addToGroup = addToGroup;
exports.removeFromGroup = removeFromGroup;
