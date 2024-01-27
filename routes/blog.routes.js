const express = require("express");
const {
  uploadImg,
  blogImgResize,
} = require("../middlewares/multer.middleware.js");
const {
  createBlog,
  updateOneBlog,
  getOneBlog,
  getAllBlogs,
  deleteOneBlog,
  likeTheBlog,
  dislikeTheBlog,
  uploadImages,
} = require("../controllers/blog.controller");
const {
  authMiddleware,
  isAdmin,
} = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put(
  "/uploads/:id",
  authMiddleware,
  isAdmin,
  uploadImg.array("images", 10),
  blogImgResize,
  uploadImages
);
router.put("/likes", authMiddleware, likeTheBlog);
router.put("/dislikes", authMiddleware, dislikeTheBlog);

router.put("/:id", authMiddleware, isAdmin, updateOneBlog);
router.get("/:id", getOneBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteOneBlog);

module.exports = router;
