const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  isAdmin,
} = require("../middlewares/auth.middleware.js");
const {
  createCategory,
  getOneBlogCategory,
  getAllBlogCategory,
  updateBlogCategory,
  deleteOneBlogCategory,
} = require("../controllers/blog.category.controller.js");
const { deleteOneBlog } = require("../controllers/blog.controller.js");

router.post("/", authMiddleware, isAdmin, createCategory);
router.get("/:id", authMiddleware, isAdmin, getOneBlogCategory);
router.get("/", authMiddleware, isAdmin, getAllBlogCategory);

router.put("/:id", authMiddleware, isAdmin, updateBlogCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteOneBlogCategory);

module.exports = router;
