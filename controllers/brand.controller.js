const Brand = require("../models/brand.model.js");
const validate_mongoDB_ID = require("../utils/validate_mongoDB_ID.js");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validate_mongoDB_ID(id);

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
      },
      { new: true }
    );
    res.json(updatedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const allBrands = await Brand.find();
    res.json(allBrands);
  } catch (error) {
    throw new Error(error);
  }
});

const getOneBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validate_mongoDB_ID(id);

    const getBrand = await Brand.findById(id);
    res.json(getBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validate_mongoDB_ID(id);

    const deletedBrand = await Brand.findByIdAndDelete(id);
    res.json(deletedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  getAllBrands,
  getOneBrand,
  updateBrand,
  deleteBrand,
};
