const express = require("express");
const {
  createProduct,
  getASingleProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require("../controller/product_controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth_middleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.get("/:id", getASingleProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/", getAllProducts);

module.exports = router;
