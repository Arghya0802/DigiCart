const { generateToken } = require("../config/jwtTokens.js");

const User = require("../models/user.model.js");
const Product = require("../models/product.model.js");
const Cart = require("../models/cart.model.js");
const Coupon = require("../models/coupon.model.js");
const Order = require("../models/order.model.js");

const asyncHandler = require("express-async-handler");
const validate_mongoDB_ID = require("../utils/validate_mongoDB_ID.js");
const { generateRefreshToken } = require("../config/refreshTokens.js");
const uniqid = require("uniqid");
// const sendMail = require("../controllers/email.controller.js");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// const generateRefreshToken = require("../config/dbConnect.js");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  // Pass an object while quering and use async await always while talking with a database
  const findUser = await User.findOne({ email });

  if (!findUser) {
    // User doesn't exists so we need to create a New User
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    // User already exists  so we throw an error
    throw new Error("User already exists");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log(`Email: ${email} and Password: ${password}`);

  // We need to check if user already exists or not
  const findUser = await User.findOne({ email });

  // If user exists, we need to check if the password matches or not
  if (findUser && (await findUser.isPasswordCorrect(password))) {
    const refreshToken = generateRefreshToken(findUser?._id);
    // console.log(refreshToken);
    const updatedUser = await User.findByIdAndUpdate(
      findUser?._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    // console.log(updatedUser);
    // If the password also matches, we should send a message indicating that Login is Successful
    res.status(200).json({
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log(`Email: ${email} and Password: ${password}`);

  // We need to check if user already exists or not
  const findAdmin = await User.findOne({ email });

  if (findAdmin.role !== "admin") throw new Error("Not Authorized!!!");

  // If user exists, we need to check if the password matches or not
  if (findAdmin && (await findAdmin.isPasswordCorrect(password))) {
    const refreshToken = generateRefreshToken(findAdmin?._id);
    // console.log(refreshToken);
    const updatedUser = await User.findByIdAndUpdate(
      findAdmin?._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    // console.log(updatedUser);
    // If the password also matches, we should send a message indicating that Login is Successful
    res.status(200).json({
      _id: findAdmin?._id,
      firstName: findAdmin?.firstName,
      lastName: findAdmin?.lastName,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// Getting all Users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.status(200).json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Getting a Single User
const getOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validate_mongoDB_ID(id);

  try {
    // console.log(`User ID: ${id}`);
    const getUser = await User.findById(id); // While using ID, don't send it as an Object
    res.status(200).json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validate_mongoDB_ID(_id);

  try {
    const updateUserAddress = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      { new: true }
    );
    res.json(updateUserAddress);
  } catch (error) {
    throw new Error(error);
  }
});

// Deleting a Single User
const deleteOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validate_mongoDB_ID(id);

  try {
    // console.log(`User ID: ${id}`);
    const getDeletedUser = await User.findByIdAndDelete(id);
    res.status(200).json(getDeletedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Updating a User
const updateOneUser = asyncHandler(async (req, res) => {
  // const { id } = req.params;
  // Instead of getting ID from req.params, we can now get the ID from Auth-Middleware
  const { _id } = req.user;
  validate_mongoDB_ID(_id);
  try {
    // console.log(`User ID: ${id}`);
    const getUpdatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req.body?.firstName,
        lastName: req.body?.lastName,
        email: req.body?.email,
        mobile: req.body?.mobile,
      },
      {
        new: true,
      }
    );

    res.status(200).json(getUpdatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Block a User [can be done by Admins only]
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validate_mongoDB_ID(id);
  try {
    const blockedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    // console.log(blockedUser);
    res.json({ message: "User Blocked Successfully", success: true });
  } catch (error) {
    throw new Error(error);
  }
});

// Unblock a User [can be done by Admins only]
const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validate_mongoDB_ID(id);
  try {
    const unBlockedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({ message: "User Un-Blocked successfully", success: true });
  } catch (error) {
    throw new Error(error);
  }
});

// Handling Refresh-Tokens
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // console.log(cookie);
  // If cookie doesn't contains Refresh-Tokens, we will throw an Error
  if (!cookie.refreshToken)
    throw new Error("No Refresh Token found with Cookies");
  const refreshToken = cookie.refreshToken;
  // console.log(refreshToken);
  const user = await User.findOne({ refreshToken });

  // If we have got refresh-token and user with the same refresh-token, we need to verify it
  if (!user) throw new Error("No User found with Refresh-Tokens");

  jwt.verify(refreshToken, process.env.SECRET_KEY, (error, decoded) => {
    if (error || user.id !== decoded.id) {
      throw new Error("There is something wrong with Refresh-Tokens");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
  // res.json(user);
});

// Logging User Out
const logOutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken)
    throw new Error("No Refresh Token found with Cookies");

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  //  If User is not found
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204).json({ message: "Invalid Credentials" }); // Forbidden to log-out with invalid credentials
  }

  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204).json({ message: "User successfully logged out" });
});

// Updating User-Password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validate_mongoDB_ID(_id);

  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    return res.json(updatedPassword);
  } else {
    return res.json(user);
  }
});

// Change Password using Email
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // console.log(user);
  if (!user) throw new Error(`No User found with email as: ${email}`);

  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi! Please follow this link to reset your password.The Link is valid for only 10 minutes!!! Please hurry up!!!! <a href="http://localhost:5000/api/v1/users/reset-password/${token}">Click Here</a>`;

    // The data created was used for Node-Mailer but Google and Yahoo have banned using SMTP servers so it's of no use
    // const data = {
    //   to: email,
    //   text: "Hey User!! Follow this link to change your password",
    //   subject: "Reset Password within 10 minutes",
    //   html: resetURL,
    // };
    // sendMail(data);

    res.json({ URL: resetURL, token });
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  console.log(password, token);
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordRestToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Session expired!!! Please try again!!!");

  user.password = password;
  user.passwordRestToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();
  res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    validate_mongoDB_ID(_id);

    const findUser = await User.findById(_id);
    res.json({ wishlist: findUser.wishlist });
  } catch (error) {
    throw new Error(error);
  }
});

const createUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validate_mongoDB_ID(_id);
  const { cart } = req.body;

  try {
    let products = [];
    // const user = await User.findById(_id);
    const alreadyOrderedCart = await Cart.findOne({ orderedBy: _id });

    if (alreadyOrderedCart) {
      await Cart.findByIdAndDelete(alreadyOrderedCart._id);
    }

    for (let i = 0; i < cart.length; i++) {
      let cartObj = {};
      cartObj.product = cart[i]._id; // Stores the Product-ID
      cartObj.quantity = cart[i].quantity;
      cartObj.color = cart[i].color;
      let orderedProduct = await Product.findById(cart[i]._id)
        .select("price")
        .exec();
      cartObj.price = orderedProduct.price;
      products.push(cartObj);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].quantity;
    }

    const newCart = await Cart.create({
      products: products,
      cartTotal: cartTotal,
      orderedBy: _id,
    });

    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validate_mongoDB_ID(_id);

  try {
    const getCart = await Cart.findOne({ orderedBy: _id }).populate(
      "products.product",
      "title brand price color"
    );
    res.json(getCart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validate_mongoDB_ID(_id);

  try {
    const deletedCart = await Cart.findOneAndDelete({ orderedBy: _id });
    res.json(deletedCart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res, next) => {
  const { coupon } = req.body;
  const { _id } = req.user;

  const getValidCoupon = await Coupon.findOne({ name: coupon });

  if (!getValidCoupon) throw new Error(`Coupon is Not Valid!!!!`);

  // const user = await User.findById(_id) ;
  const { products, cartTotal } = await Cart.findOne({
    orderedBy: _id,
  }).populate("products.product", "title brand price color");

  let discountPercent = (getValidCoupon.discount / 100).toFixed(2);

  let totalAfterDiscount = cartTotal - (discountPercent * cartTotal).toFixed(2);

  const updatedCart = await Cart.findOneAndUpdate(
    { orderedBy: _id },
    { totalAfterDiscount },
    { new: true }
  );

  res.json(updatedCart);
});

const createOrder = asyncHandler(async (req, res) => {
  const { isCOD, appliedCoupons } = req.body;
  const { _id } = req.user;
  validate_mongoDB_ID(_id);

  try {
    if (!isCOD) throw new Error("Order couldn't be placed!!!");

    // const user = await User.findById(_id);
    const userCart = await Cart.findOne({ orderedBy: _id });
    let finalAmount = 0;

    if (appliedCoupons) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }
    const userOrder = await Order.create({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "Cash On Delivery",
        amount: finalAmount,
        status: "COD",
        placedAt: Date.now(),
        currency: "US-Dollars",
      },
      orderStatus: "Cash on Delivery",
      orderedBy: _id,
    });

    res.json(userOrder);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validate_mongoDB_ID(_id);

  try {
    const userOrder = await Order.find({ orderedBy: _id })
      .populate("products.product")
      .exec();
    res.json(userOrder);
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;
  validate_mongoDB_ID(orderId);

  try {
    const updatedStatus = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus: status,
      },
      { new: true }
    );
    res.json(updatedStatus);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getOneUser,
  deleteOneUser,
  updateOneUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logOutUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  createUserCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getUserOrder,
  updateOrderStatus,
};
