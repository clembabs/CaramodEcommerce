const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const util = require("../utils/util");
const jwt = require("jsonwebtoken");
const validateMongoDbID = require("../utils/validate_mongodbid");
const sendEmail = require("./email_controller");
validateMongoDbID;

// @desc    Register a user
// @access  Public
const createUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await util.hashPassword(password);

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

  const user = await User.findOne({ email });

  if (user && (await util.isPasswordMatched(password, user.password))) {
    const refreshToken = await generateRefreshToken(user._id);
    const updateUser = await User.findByIdAndUpdate(
      user.id,
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

//Admin Login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") throw new Error("Not Authorized");

  if (
    adminUser &&
    (await util.isPasswordMatched(password, adminUser.password))
  ) {
    const refreshToken = await generateRefreshToken(adminUser._id);
    const updateUser = await User.findByIdAndUpdate(
      adminUser.id,
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
    res.json({
      _id: adminUser.id,
      firstName: adminUser.firstname,
      lastName: adminUser.lastname,
      email: adminUser.email,
      mobile: adminUser?.mobile,
      token: generateToken(adminUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc    Update a user
// @access  Private
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

// @desc    get all users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();

    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// @desc    get a single user
// @access  Admin
const getASingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const getUser = await User.findById(id);

    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

// @desc    delete a user
// @access  Admin
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

// @desc    block a user
// @access  Admin
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

// @desc    unblock a user
// @access  Admin
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

// @desc    handle refresh token
// @access  Public
const handleRefreshToken = asyncHandler(async (req, res) => {
  const { cookie } = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh Token in database");
  jwt.verify(refreshToken, process.env.TZ, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with the refresh token");
    }
    const accessToken = generateToken(user._id);
    res.json(accessToken);
  });
});

//Logout
const logoutUser = asyncHandler(async (req, res) => {
  const { cookie } = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in cookies");
  rror(error);
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(refreshToken, {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});

// const resetPassword = asyncHandler(async (req,res) => {
//   const { password } = req.body;
//   const { token } = req.params;

//   const hashedToken = crypto.createHash("256").update(token).digest("hex");
//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now()},
//   });

//   if(!user) throw new Error("Token Expired, Please try again later");
//   user.password = password;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();
//   res.json(user);
// })

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please click on the link to reset password, this link is valid for 10mins. <a href>='http://localhost:5005/api/user/reset-password'`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgost Password link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});


//Get Wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate('wishlist');
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

//Save Address
const saveUserAddress = asyncHandler(async (req,res, next) => {
  const { _id } = req.user;
  validateMongoDbID(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
       
      }, {
        new: true,
      }
    )
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
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
  handleRefreshToken,
  logoutUser,
  forgotPasswordToken,
  loginAdmin,
  getWishlist,
  saveUserAddress,
};
