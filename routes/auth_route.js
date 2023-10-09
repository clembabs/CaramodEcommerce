const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getASingleUser,
  deleteAUser,
  updateUser,
  blockAUser,
  unblockAUser,
  handleRefreshToken,
  logoutUser,
  loginAdmin,
  getWishlist,
  saveUserAddress,
} = require("../controller/user_controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth_middleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.get("/all-users", authMiddleware, isAdmin, getAllUsers);
router.get("/:id", getASingleUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutUser);
router.delete("/:id", deleteAUser);
router.put("/edit-user", authMiddleware, updateUser);

router.get("/wishlist", authMiddleware, getWishlist);
router.put("/save-address", authMiddleware, saveUserAddress);


router.put("/block-user/:id", authMiddleware, isAdmin, blockAUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockAUser);

module.exports = router;
