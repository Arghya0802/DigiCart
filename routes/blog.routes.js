const express = require("express");
const {
  createBlog,
  updateOneBlog,
  getOneBlog,
  getAllBlogs,
  deleteOneBlog,
  likeTheBlog,
  dislikeTheBlog,
} = require("../controllers/blog.controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/likes", authMiddleware, likeTheBlog);
router.put("/dislikes", authMiddleware, dislikeTheBlog);

router.put("/:id", authMiddleware, isAdmin, updateOneBlog);
router.get("/:id", getOneBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteOneBlog);

module.exports = router;
