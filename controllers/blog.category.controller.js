const BlogCategory = require("../models/blog.category.model.js");
const validate_mongoDB_ID = require("../utils/validate_mongoDB_ID.js");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const new_Blog_Category = await BlogCategory.create(req.body);
    res.json(new_Blog_Category);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlogCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validate_mongoDB_ID(id);

    const update_Blog_Category = await BlogCategory.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
      },
      { new: true }
    );
    res.json(update_Blog_Category);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogCategory = asyncHandler(async (req, res) => {
  try {
    const All_Blog_Categories = await BlogCategory.find();
    res.json(All_Blog_Categories);
  } catch (error) {
    throw new Error(error);
  }
});

const getOneBlogCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validate_mongoDB_ID(id);

    const Get_Blog_Category = await BlogCategory.findById(id);
    res.json(Get_Blog_Category);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteOneBlogCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validate_mongoDB_ID(id);

    const deletedCategory = await BlogCategory.findByIdAndDelete(id);
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  updateBlogCategory,
  deleteOneBlogCategory,
  getAllBlogCategory,
  getOneBlogCategory,
};
