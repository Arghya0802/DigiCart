const mongoose = require("mongoose");
// const Product = require("./product.model");

const ProductCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product-Category", ProductCategorySchema);
