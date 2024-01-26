const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const dbConnect = require("./config/dbConnect");
const userRouter = require("./routes/user.routes.js");
const productRouter = require("./routes/product.routes.js");
const blogRouter = require("./routes/blog.routes.js");
const ProductCategoryRouter = require("./routes/product.category.routes.js");
const BlogCategoryRouter = require("./routes/blog.category.routes.js");
const brandRouter = require("./routes/brand.routes.js");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { notFound, errorHandler } = require("./middlewares/errorHandler.js");

dbConnect();

// app.use("/", (req, res) => {
//   console.log(`Hello from server side`);
// });

app.use(morgan("dev")); // Use to know more about our URLs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// User Routes including Login, Logout and Authorization
app.use("/api/v1/users", userRouter);

// Product Routes
app.use("/api/v1/products", productRouter);

// Blog Routes
app.use("/api/v1/blogs", blogRouter);

// Product-Category Routes
app.use("/api/v1/product-category", ProductCategoryRouter);

// Blog-Category Routes
app.use("/api/v1/blog-category", BlogCategoryRouter);

// Brand Routes
app.use("/api/v1/brands", brandRouter);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening at PORT ${PORT}`);
});
