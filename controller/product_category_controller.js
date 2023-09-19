const asyncHandler = require("express-async-handler");
const Category = require("../models/category.model");
const validateMongoDbID = require("../utils/validate_mongodbid");

const createCategory = asyncHandler(async (req, res) => {
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

const updateCategory = asyncHandler(async (req, res) => {
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

const deleteCategory = asyncHandler(async (req, res) => {
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

const getSingleCategory = asyncHandler(async (req, res) => {
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

const getAllCategories = asyncHandler(async (req, res) => {
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
  createCategory,
  updateCategory,
  deleteCategory,
  getSingleCategory,
  getAllCategories,
};
