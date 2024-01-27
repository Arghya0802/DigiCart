const express = require("express");
const {
  createProduct,
  getOneProduct,
  getAllProducts,
  updateOneProduct,
  deleteOneProduct,
  addToWishlist,
  rateProduct,
  uploadImages,
} = require("../controllers/product.controller");
const { isAdmin, authMiddleware } = require("../middlewares/auth.middleware");
const {
  uploadImg,
  productImgResize,
} = require("../middlewares/multer.middleware");
const router = express.Router();

// Only an Admin can Create, Read, Update and Delete Products from our store
router.post("/", authMiddleware, isAdmin, createProduct);
router.put(
  "/uploads/:id",
  authMiddleware,
  isAdmin,
  uploadImg.array("images", 10),
  productImgResize,
  uploadImages
);

router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/ratings", authMiddleware, rateProduct);

router.get("/:id", authMiddleware, getOneProduct);
router.get("/", authMiddleware, getAllProducts);

router.put("/:id", authMiddleware, isAdmin, updateOneProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteOneProduct);

module.exports = router;
