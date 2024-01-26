const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getOneUser,
  deleteOneUser,
  updateOneUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logOutUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
} = require("../controllers/user.controller");
const router = express.Router();

const {
  authMiddleware,
  isAdmin,
} = require("../middlewares/auth.middleware.js");

router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logOutUser);
router.get("/all-users", getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getOneUser);
router.put("/password", authMiddleware, updatePassword);

router.delete("/:id", deleteOneUser);
router.put("/edit-user", authMiddleware, updateOneUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router;
