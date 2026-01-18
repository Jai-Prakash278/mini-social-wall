const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/authController");
const verifyToken = require("../middleware/auth");

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.get("/me", verifyToken, authController.getCurrentUser);

module.exports = authRouter;
