const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

router
  .route("/register")
  .get(authMiddleware.isLogout, userController.registerLoad)
  .post(uploadSingleImage("image"), userController.register);

router
  .route("/login")
  .get(authMiddleware.isLogout, userController.loginLoad)
  .post(userController.login);
router.route("/logout").get(authMiddleware.isLogin, userController.logout);
router
  .route("/dashboard")
  .get(authMiddleware.isLogin, userController.dashboardLoad);

router.route("/saveChat").post(authMiddleware.isLogin, userController.saveChat);

router.route("/deleteChat/:id").get(authMiddleware.isLogin, userController.deleteChat);

module.exports = router;
