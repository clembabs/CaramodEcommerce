const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/auth_middleware");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getSingleCategory,
  getAllCategories,
} = require("../controller/product_category_controller");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);
router.get("/:id", getSingleCategory);
router.get("/", getAllCategories);


module.exports = router;
