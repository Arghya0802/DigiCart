const express = require("express");
const {
  createCategory,
  updateProductCategory,
  getOneProductCategory,
  getAllProductCategory,
  deleteOneProductCategory,
} = require("../controllers/product.category.controller.js");
const {
  authMiddleware,
  isAdmin,
} = require("../middlewares/auth.middleware.js");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory);
router.get("/:id", authMiddleware, isAdmin, getOneProductCategory);
router.get("/", authMiddleware, isAdmin, getAllProductCategory);

router.put("/:id", authMiddleware, isAdmin, updateProductCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteOneProductCategory);
module.exports = router;
