const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const bcrypt = require("bcrypt");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadUserImage = uploadSingleImage("image");

exports.registerLoad = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

exports.register = async (req, res) => {
  try {
    console.log("Received File:", req.file);
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.username,
      email: req.body.email,
      image: req.file.filename,
      password: hashPassword,
    });
    await user.save();
    res.render("register", {
      message: "User registered successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

exports.loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email });

    if (userData) {
      const comparePassword = await bcrypt.compare(password, userData.password);
      if (comparePassword) {
        req.session.user = userData;
        res.redirect("/dashboard");
      } else {
        res.render("login", {
          message: "Invalid email or password",
        });
      }
    } else {
      res.render("login", {
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "fail",
          message: "Internal server error",
        });
      }
      return res.redirect("/login");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

exports.dashboardLoad = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    const users = await User.find({ _id: { $nin: [req.session.user._id] } });
    res.render("dashboard", { user: req.session.user, users: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

exports.saveChat = async (req, res) => {
  try {
    const chat = new Chat({
      sender_id: req.body.sender_id,
      receiver_id: req.body.receiver_id,
      message: req.body.message,
    });
    const newChat = await chat.save();
    
    res.status(200).json({
      status: "success",
      message: "Chat saved successfully",
      data: newChat,
    }); 
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};