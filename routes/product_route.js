const express = require("express");
const {
  createProduct,
  getASingleProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  addToWishlist,
  incDecRatings,
  uploadProductImages,
} = require("../controller/product_controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth_middleware");
const {
  uploadPhoto,
  productImageResize,
} = require("../middlewares/cloudinary_middleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.post(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 5),
  productImageResize,
  uploadProductImages,
);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/ratings", authMiddleware, incDecRatings);
router.get("/:id", getASingleProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/", getAllProducts);

module.exports = router;
