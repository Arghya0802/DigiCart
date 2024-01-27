const express = require("express");
const {
  authMiddleware,
  isAdmin,
} = require("../middlewares/auth.middleware.js");
const {
  createCoupon,
  updateCoupon,
  getAllCoupons,
  getOneCoupon,
  deleteCoupon,
} = require("../controllers/coupon.controller");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupons);
router.get("/:id", authMiddleware, isAdmin, getOneCoupon);

router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
