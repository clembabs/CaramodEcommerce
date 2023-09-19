const express = require("express");
const dbConnect = require("./config/dbconnect");
const dotenv = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/auth_route");
const productRouter = require("./routes/product_route");
const blogRouter = require("./routes/blog_route");
const productCategoryRouter = require("./routes/product_category_route");
const blogCategoryRouter = require("./routes/blog_category_route");
const brandRouter = require("./routes/brand_route");
const bodyParser = require("body-parser");
const { errorHandler } = require("./middlewares/error_handlers");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

dbConnect();
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", productCategoryRouter);
app.use("/api/blog-category", blogCategoryRouter);
app.use("/api/brand", brandRouter);
app.use(errorHandler);
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
