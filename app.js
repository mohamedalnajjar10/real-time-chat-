const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const app = express();
const server = http.createServer(app);
dotenv.config({ path: "./config.env" });
const socketio = require("socket.io");
const io = socketio(server);
const session = require("express-session");
const userRoute = require("./routes/userRoute");
const User = require("./models/userModel");
const connectDB = require("./config/database");
const Chat = require("./models/chatModel");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

// EJS - Template Engine
app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", userRoute);

// How to Update the User Online Offline Status
const usp = io.of("/user-namespace");
usp.on("connection", async (socket) => {
  console.log("User connected to user namespace");
  const userId = socket.handshake.auth.token;

  try {
    await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { is_Online: true } }
    );

    // Join user's own room
    socket.join(userId);

    // user broadcast online status
    socket.broadcast.emit("getOnlineUser", {
      user_id: userId,
      is_Online: true,
    });

    // Handle incoming messages
    socket.on("sendMessage", async (data) => {
      try {
        const chat = new Chat({
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          message: data.message,
        });
        const newChat = await chat.save();

        // Broadcast message to the receiver's room
        usp.to(data.receiver_id).emit("receiveMessage", {
          _id: newChat._id,
          sender_id: data.sender_id,
          message: data.message,
          timestamp: new Date()
        });

        // Also send the message back to the sender to ensure persistence
        socket.emit("receiveMessage", {
          _id: newChat._id,
          sender_id: data.sender_id,
          message: data.message,
          timestamp: new Date()
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // Handle message deletion
    socket.on("deleteMessage", async (data) => {
      try {
        const chat = await Chat.findByIdAndDelete(data.id);
        if (chat) {
          // Broadcast delete event to all connected clients in the namespace
          usp.emit("messageDeleted", { id: chat._id });
        }
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    });

    // Load existing chat
    socket.on("existingChat", async (data) => {
      try {
        const chats = await Chat.find({
          $or: [
            { sender_id: data.sender_id, receiver_id: data.receiver_id },
            { sender_id: data.receiver_id, receiver_id: data.sender_id }
          ]
        }).sort({ createdAt: 1 }); // Sort by creation time

        // Send the chat history to the requesting socket
        socket.emit("loadExistingChat", chats);
      } catch (error) {
        console.error("Error loading existing chat:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected from user namespace");
      try {
        await User.findByIdAndUpdate(
          { _id: userId },
          { $set: { is_Online: false } }
        );
        // user broadcast offline status
        socket.broadcast.emit("getOfflineUser", {
          user_id: userId,
          is_Online: false,
        });
      } catch (error) {
        console.error("Error updating user offline status:", error);
      }
    });
  } catch (error) {
    console.error("Error updating user online status:", error);
  }
});

// Start server only after database connection is established
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const PORT = process.env.PORT || 2000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
