const Blog = require("../models/blog.model.js");
const User = require("../models/user.model.js");
const validate_mongoDB_ID = require("../utils/validate_mongoDB_ID");
const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const updateOneBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validate_mongoDB_ID(id);
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updatedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getOneBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validate_mongoDB_ID(id);
    const updateBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const allBlogs = await Blog.find();
    // validate_mongoDB_ID(id);
    res.json(allBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteOneBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.json(deleteBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const likeTheBlog = asyncHandler(async (req, res) => {
  try {
    // User should be logged-in
    // We will get user from authMiddleware
    // We will increment the count of likes of the particular blog using put() request
    // If User has already disliked the post, we need to update it
    // For liking, the user has to send which post he's wants to like
    const { blogId } = req?.body;
    const { _id } = req?.user?._id;
    // console.log(_id);
    validate_mongoDB_ID(blogId);
    // validate_mongoDB_ID(loginId);

    const blog = await Blog.findById(blogId);
    const user = await User.findById(_id);

    const isLiked = blog.isLiked;
    const isAlreadyDisliked = blog?.dislikes?.find(
      (userId) => userId.toString() === _id.toString()
    );

    if (isAlreadyDisliked) {
      const updateBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: user._id },
          isDisliked: false,
        },
        { new: true }
      );

      return res.json(updateBlog);
    }

    if (isLiked) {
      const updateBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: user._id },
          isLiked: false,
        },
        { new: true }
      );
      return res.json(updateBlog);
    } else {
      const updateBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: user._id },
          isLiked: true,
        },
        { new: true }
      );

      return res.json(updateBlog);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const dislikeTheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const { _id } = req?.user?._id;
  validate_mongoDB_ID(blogId);
  console.log(_id);
  const blog = await Blog.findById(blogId);
  const user = await User.findById(_id);

  const isDisliked = blog.isDisliked;
  // console.log(isDisliked);

  const isAlreadyLiked = blog?.likes?.find(
    (userId) => userId.toString() === _id.toString()
  );

  // If Blog is already liked, so if we dislike it again, likes will be removed for likes[]
  if (isAlreadyLiked) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: user._id },
        isLiked: false,
      },
      { new: true }
    );

    return res.json(updatedBlog);
  }

  // If user has already disliked the blog, clicking again will make it neutral
  if (isDisliked) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: user._id },
        isDisliked: false,
      },
      { new: true }
    );

    return res.json(updatedBlog);
  } else {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: user._id },
        isDisliked: true,
      },
      { new: true }
    );

    return res.json(updatedBlog);
  }
});

module.exports = {
  createBlog,
  updateOneBlog,
  getOneBlog,
  getAllBlogs,
  deleteOneBlog,
  likeTheBlog,
  dislikeTheBlog,
};
