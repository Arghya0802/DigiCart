const Product = require("../models/product.model.js");
const User = require("../models/user.model.js");

const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validate_mongoDB_ID = require("../utils/validate_mongoDB_ID.js");

// Creating a New-Product
const createProduct = asyncHandler(async (req, res) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Update a Product
const updateOneProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("No Product ID found!!!");

    if (req.body.title) {
      // Slugify the title
      req.body.slug = slugify(req.body.title);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a Product
const deleteOneProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Get One product with the help of ID
const getOneProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // If we don't get any ID in our query string, we need to throw an error
    if (!id) throw new Error("Product ID not found");

    const getProduct = await Product.findById(id);
    // If we don't get any product with given ID, we need to throw an error
    if (!getProduct) throw new Error("No Product found with given ID");

    res.json(getProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Get All products present in our store
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // Advanced filtering on our Query Parameters
    const queryObj = { ...req.query }; // Getting all the Queries from Req.Query

    const excludeFields = ["page", "sort", "limit", "fields"];
    // Excluding fields like sort, page from our query object
    excludeFields.forEach((field) => delete queryObj[field]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    // We should not do await here
    let queriedProducts = Product.find(JSON.parse(queryString));

    // Sorting our queries if asked else we will sort based on our preference
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queriedProducts = queriedProducts.sort(sortBy);
    } else {
      queriedProducts = queriedProducts.sort("-price");
    }

    // Showing the relevant Fields to user only
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      // console.log(fields);
      queriedProducts = queriedProducts.select(fields);
    } else {
      queriedProducts = queriedProducts.select(
        "title brand category price images ratings totalRating"
      );
    }

    // Pagination --> How many items we will display in our page
    const page = req.query?.page;
    const limit = req.query?.limit;
    const skip = (page - 1) * limit;
    queriedProducts = queriedProducts.skip(skip).limit(limit);

    // If the Number of Skipped products is more than the Total products, we need to throw an error
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page doesn't exists");
    }

    const getAllItems = await queriedProducts;
    res.json(getAllItems);
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishlist = asyncHandler(async (req, res) => {
  try {
    const { _id } = req?.user;
    validate_mongoDB_ID(_id);
    const { prodId } = req?.body;
    validate_mongoDB_ID(prodId);

    const user = await User.findById(_id);
    const isAlreadyAdded = user.wishlist.find(
      (id) => id.toString() === prodId.toString()
    );

    if (isAlreadyAdded) {
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        { new: true }
      );
      // console.log(user, updatedUser);
      return res.json(updatedUser);
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        { new: true }
      );

      return res.json(updatedUser);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rateProduct = asyncHandler(async (req, res) => {
  try {
    const { _id } = req?.user;
    validate_mongoDB_ID(_id);
    const { star, prodId, comment } = req?.body;
    validate_mongoDB_ID(prodId);

    const product = await Product.findById(prodId);
    let updatedProduct;
    const isAlreadyRated = product.ratings.find(
      (rated) => rated.postedBy.toString() === _id.toString()
    );

    if (isAlreadyRated) {
      updatedProduct = await Product.findOneAndUpdate(
        { _id: prodId, "ratings.postedBy": _id },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        { new: true }
      );
      // res.json(updatedProduct);
    } else {
      updatedProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedBy: _id,
            },
          },
        },
        { new: true }
      );
      // res.json(updatedProduct);
    }

    const getAllRatings = updatedProduct.ratings;
    const noOfRatings = getAllRatings.length;

    const sumOfRatings = getAllRatings.reduce(
      (acc, item) => acc + item.star,
      0
    );

    const newRating = Math.round(sumOfRatings / noOfRatings);
    const finalUpdatedProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalRating: newRating,
      },
      { new: true }
    );

    res.json(finalUpdatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getOneProduct,
  getAllProducts,
  updateOneProduct,
  deleteOneProduct,
  addToWishlist,
  rateProduct,
};
