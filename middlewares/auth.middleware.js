const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    // We split the req.headers.authorization into an array and we take the 2nd value
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(`Token: ${token} and Decoded: ${decoded}`);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error(
        `Not authorized or Token expired!!! Please Log-In again!!!`
      );
    }
  } else {
    throw new Error("No token found in headers");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  // We will get everything regarding the User in our Req.User
  // console.log(req.user);
  const { email } = req.user;
  const adminUser = await User.findOne({ email });

  if (adminUser.role === "admin") {
    next();
  } else {
    throw new Error("Permission restricted!!! You are not an Admin!!!");
  }
});

module.exports = { authMiddleware, isAdmin };
