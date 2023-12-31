const asyncHandler = require("express-async-handler");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const validateMongoDbID = require("../utils/validate_mongodbid");
const { cloudinaryUploadImage } = require("../utils/cloudinary");
const fs = require("fs");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.slugify);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.slugify);
    }
    const updatedProduct = await Product.findOneAndUpdate(_id, req.body, {
      new: true,
    });

    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  try {
    const deletedProduct = await Product.findOneAndDelete(_id, req.body, {
      new: true,
    });

    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getASingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const getProduct = await Product.findById(id);
    res.json(getProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // const getProducts = await Product.find(req.query);

    //Filtering using Get All Product Endpoint
    const queryObj = { ...req.query };
    const excludeFields = ["page", "limit", "sort", "fields"];
    excludeFields.forEach((el) => delete queryObj(el));
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    //Sorting
    if (req.query.sort) {
      const sortProductBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortProductBy);
    } else {
      query = query.sort(".createdAt");
    }

    //Limiting
    if (req.query.fields) {
      const limitFields = req.query.fields.split(",").join(" ");
      query = query.select(limitFields);
    } else {
      query = query.select("-__v");
    }

    //Paginating Products

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip == productCount) throw new Error("Does not exist");
    }
    console.log(page, limit, skip);

    const getProducts = await query;
    res.json(getProducts);
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.body;
  validateMongoDbID(productId);

  try {
    const user = await User.findById(_id);
    const alreadyAdded = user?.wishlist?.find(
      (userId) => userId?.toString() === productId?.toString()
    );

    if (alreadyAdded) {
      const user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: productId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      const user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: productId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {}
});

const incDecRatings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, productId, comment } = req.body;

  try {
    const product = await Product.findById(_id);
    const alreadyRated = product?.ratings?.find(
      (userId) => userId?.toString() === productId?.toString()
    );

    if (alreadyRated) {
      const updateRating = await Product.findByIdAndUpdate(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const updateRating = await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedBy: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getAllRatings = await Product.findById(productId);
    let totalRating = getAllRatings.ratings.length;
    let ratingsum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((previous, current) => previous + current, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let productRatings = await Product.findByIdAndUpdate(
      productId,
      {
        totalRating: actualRating,
      },
      {
        new: true,
      }
    );
    res.json(productRatings);
  } catch (error) {}
});

const uploadProductImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const uploader = (path) => cloudinaryUploadImage(path, "images");
    const urls = [];
    const files = req.files;
    for (const file in files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
      
    }
    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  updateProduct,
  getASingleProduct,
  getAllProducts,
  deleteProduct,
  addToWishlist,
  incDecRatings,
  uploadProductImages,
};
