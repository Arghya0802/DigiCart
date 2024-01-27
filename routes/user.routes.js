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
  loginAdmin,
  getWishlist,
  saveAddress,
  getUserCart,
  createUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getUserOrder,
  updateOrderStatus,
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

router.post("/cart", authMiddleware, createUserCart);
router.post("/cart/coupons", authMiddleware, applyCoupon);
router.post("/my-order", authMiddleware, createOrder);

router.get("/cart", authMiddleware, getUserCart);
router.get("/my-order", authMiddleware, getUserOrder);
router.get("/wishlist", authMiddleware, getWishlist);

router.put("/save-address", authMiddleware, saveAddress);
router.post("/admin-login", loginAdmin);
router.put(
  "/orders/order-status/:orderId",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);

router.get("/refresh", handleRefreshToken);
router.get("/logout", logOutUser);
router.get("/all-users", getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getOneUser);
router.put("/password", authMiddleware, updatePassword);

router.delete("/cart", authMiddleware, emptyCart);
router.delete("/:id", authMiddleware, deleteOneUser);

router.put("/edit-user", authMiddleware, updateOneUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router;
