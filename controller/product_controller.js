const asyncHandler = require("express-async-handler");
const Product = require("../models/product.model");
const validateMongoDbID = require("../utils/validate_mongodbid");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.slugify);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.slugify);
    }
    const updatedProduct = await Product.findOneAndUpdate(_id, req.body, {
      new: true,
    });

    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  try {
    const deletedProduct = await Product.findOneAndDelete(_id, req.body, {
      new: true,
    });

    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getASingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const getProduct = await Product.findById(id);
    res.json(getProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // const getProducts = await Product.find(req.query);

    //Filtering using Get All Product Endpoint
    const queryObj = { ...req.query };
    const excludeFields = ["page", "limit", "sort", "fields"];
    excludeFields.forEach((el) => delete queryObj(el));
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    //Sorting
    if (req.query.sort) {
      const sortProductBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortProductBy);
    } else {
      query = query.sort(".createdAt");
    }

    //Limiting
    if (req.query.fields) {
      const limitFields = req.query.fields.split(",").join(" ");
      query = query.select(limitFields);
    } else {
      query = query.select("-__v");
    }

    //Paginating Products

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip == productCount) throw new Error("Does not exist");
    }
    console.log(page, limit, skip);

    const getProducts = await query;
    res.json(getProducts);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  updateProduct,
  getASingleProduct,
  getAllProducts,
  deleteProduct,
};
