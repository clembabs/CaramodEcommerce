const express = require("express");

const { authMiddleware, isAdmin } = require("../middlewares/auth_middleware");
const {
  createBlog,
  updateBlog,
  getSingleBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  uploadBlogImages,
} = require("../controller/blog_controller");
const { blogImageResize } = require("../middlewares/cloudinary_middleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.post(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 5),
  blogImageResize,
  uploadBlogImages,
);
router.put("/likes", authMiddleware, likeBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getSingleBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);


module.exports = router;
