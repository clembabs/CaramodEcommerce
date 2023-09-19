const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/auth_middleware");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getSingleBrand,
  getAllBrands,
} = require("../controller/brand_controller");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);
router.get("/:id", getSingleBrand);
router.get("/", getAllBrands);

module.exports = router;
