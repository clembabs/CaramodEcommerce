const express = require("express");

const { authMiddleware, isAdmin } = require("../middlewares/auth_middleware");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controller/coupon_controller");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/coupons", authMiddleware, isAdmin, getAllCoupons);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

router.post(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 5),
  blogImageResize,
  uploadBlogImages
);
router.put("/likes", authMiddleware, likeBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getSingleBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
