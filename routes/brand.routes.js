const express = require("express");
const {
  authMiddleware,
  isAdmin,
} = require("../middlewares/auth.middleware.js");
const {
  createBrand,
  getOneBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
} = require("../controllers/brand.controller.js");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrand);
router.get("/:id", authMiddleware, isAdmin, getOneBrand);
router.get("/", authMiddleware, isAdmin, getAllBrands);

router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);

module.exports = router;
