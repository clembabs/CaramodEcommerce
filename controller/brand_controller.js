const asyncHandler = require("express-async-handler");
const Brand = require("../models/brand.model");
const validateMongoDbID = require("../utils/validate_mongodbid");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = Brand.create(req.body);
    res.json({
      status: "success",
      newBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const updatedBrand = Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      status: "success",
      updatedBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const deletedBrand = Brand.findByIdAndDelete(id);
    res.json({
      status: "Brand Deleted",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const getBrand = Brand.findById(id);

    res.json({
      status: "success",
      getBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const getAll = Brand.find();
    res.json({
      status: "success",
      getAll,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getSingleBrand,
  getAllBrands,
};
