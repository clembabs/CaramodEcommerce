const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/auth_middleware");
const {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getSingleBlogCategory,
  getAllBlogCategories,
} = require("../controller/blog_category_controller");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlogCategory);
router.put("/:id", authMiddleware, isAdmin, updateBlogCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteBlogCategory);
router.get("/:id", getSingleBlogCategory);
router.get("/", getAllBlogCategories);

module.exports = router;
