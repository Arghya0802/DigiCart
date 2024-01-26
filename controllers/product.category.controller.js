const ProductCategory = require("../models/product.category.model.js");
const validate_mongoDB_ID = require("../utils/validate_mongoDB_ID.js");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const new_Product_Category = await ProductCategory.create(req.body);
    res.json(new_Product_Category);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProductCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validate_mongoDB_ID(id);

    const update_Product_Category = await ProductCategory.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
      },
      { new: true }
    );
    res.json(update_Product_Category);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProductCategory = asyncHandler(async (req, res) => {
  try {
    const All_Product_Categories = await ProductCategory.find();
    res.json(All_Product_Categories);
  } catch (error) {
    throw new Error(error);
  }
});

const getOneProductCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validate_mongoDB_ID(id);

    const Get_Product_Category = await ProductCategory.findById(id);
    res.json(Get_Product_Category);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteOneProductCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validate_mongoDB_ID(id);

    const deletedCategory = await ProductCategory.findByIdAndDelete(id);
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  updateProductCategory,
  getAllProductCategory,
  getOneProductCategory,
  deleteOneProductCategory,
};
