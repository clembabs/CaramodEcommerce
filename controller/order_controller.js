const asyncHandler = require("express-async-handler");
const validateMongoDbID = require("../utils/validate_mongodbid");
const Order = require("../models/order_model");

const createOrder = asyncHandler(async (req, res) => {
  try {
    const newOrder = Order.create(req.body);
    res.json({
      status: "success",
      newOrder,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const allOrder = Order.find();
    res.json({
      status: "success",
      allOrder,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const updatedOrder = Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      status: "success",
      updatedOrder,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbID(id);
    try {
      const deletedDeleted = Order.findByIdAndDelete(id);
      res.json({
        status: "Deleted",
      });
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = {
  createOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
