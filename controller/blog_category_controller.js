const asyncHandler = require("express-async-handler");
const BlogCategory = require("../models/blog_category_model");
const validateMongoDbID = require("../utils/validate_mongodbid");

const createBlogCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = Category.create(req.body);
    res.json({
      status: "success",
      newCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const updatedCategory = Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      status: "success",
      updatedCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const deletedCategory = Category.findByIdAndDelete(id);
    res.json({
      status: "Blog Deleted",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const getCategory = Category.findById(id);

    res.json({
      status: "success",
      getCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogCategories = asyncHandler(async (req, res) => {
  try {
    const getAll = Category.find();
    res.json({
      status: "success",
      getAll,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getSingleBlogCategory,
  getAllBlogCategories,
};
