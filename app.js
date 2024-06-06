const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
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
    "GET",
    "POST",
    "PATCH",
    "DELETE",
    "OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method == "OPTIONS") {
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
  return res.status(200).json({
    message: "Hello World",
  });
});
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qaath81.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    const server = app.listen(3000, () => {
      console.log(`Server is running on port ${server.address().port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
