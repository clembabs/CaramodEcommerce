const asyncHandler = require("express-async-handler");
const validateMongoDbID = require("../utils/validate_mongodbid");
const Coupon = require("../models/coupon_model");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = Coupon.create(req.body);
    res.json({
      status: "success",
      newCoupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const allCoupon = Coupon.find();
    res.json({
      status: "success",
      allCoupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const updatedCoupon = Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      status: "success",
      updatedCoupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbID(id);
    try {
      const deletedDeleted = Coupon.findByIdAndDelete(id);
      res.json({
        status: "Deleted",
      });
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};
