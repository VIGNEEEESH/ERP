const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const attendanceRoutes = require("./Routes/Attendance-Routes");
const clientRoutes = require("./Routes/Client-Routes");
const departmentRoutes = require("./Routes/Department-Routes");
const leaveRoutes = require("./Routes/Leave-Routes");
const productRoutes = require("./Routes/Product-Routes");
const projectRoutes = require("./Routes/Project-Routes");
const taskRoutes = require("./Routes/Task-Routes");
const userRoutes = require("./Routes/User-Routes");
const workRoutes = require("./Routes/Work-Routes");
const messageRoutes = require("./Routes/Message-Routes");
const chatRoutes = require("./Routes/Chat-Routes");
const path = require("path");
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS,PUT"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/api/erp/attendance", attendanceRoutes);
app.use("/api/erp/client", clientRoutes);
app.use("/api/erp/department", departmentRoutes);
app.use("/api/erp/leave", leaveRoutes);
app.use("/api/erp/product", productRoutes);
app.use("/api/erp/project", projectRoutes);
app.use("/api/erp/task", taskRoutes);
app.use("/api/erp/user", userRoutes);
app.use("/api/erp/work", workRoutes);
app.use("/api/erp/message", messageRoutes);
app.use("/api/erp/chat", chatRoutes);
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello World" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ error: "Something went wrong!" });
});

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qaath81.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const server = app.listen(3000, () => {
      console.log(`Server is running on port ${server.address().port}`);
    });

    const io = require("socket.io")(server, {
      pingTimeout: 60000,
      cors: {
        origin: true,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("Connected to socket.io");
      socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        socket.join(room);
      });
      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

      socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;

          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });

      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
