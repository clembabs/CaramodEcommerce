const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const util = require("../utils/util");
const jwt = require("jsonwebtoken");
const validateMongoDbID = require("../utils/validate_mongodbid");
validateMongoDbID;

const createUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await util.hashPassword(password);

  // Create user
  const user = await User.create({
    firstname,
    lastname,
    email,
    mobile,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      mobile: user?.mobile,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await util.isPasswordMatched(password, user.password))) {
    res.json({
      _id: user.id,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      mobile: user?.mobile,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbID(id);
  const user = req?.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        mobile: user?.mobile,
      },
      {
        new: true,
      }
    );

    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();

    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

const getASingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const getUser = await User.findById(id);
    console.log(getUser);
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({
      message: "User deleted",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const blockAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        isUserBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockAUser);
  } catch (error) {
    throw new Error(error);
  }
});

const unblockAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const unblockUser = await User.findByIdAndUpdate(
      id,
      {
        isUserBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json(unblockAUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  getAllUsers,
  getASingleUser,
  deleteAUser,
  blockAUser,
  unblockAUser,
};
