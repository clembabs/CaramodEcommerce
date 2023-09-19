const mongoose = require("mongoose");
// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "slug is required"],
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    quantity: {
      type: Number,
      required: [true, "quantuty is required"],
    },
    category: {
      type: String,
      required: [true, "category is required"],
    },
    brand: {
      type: String,
      required: [true, "brand is required"],
    },
    color: {
      type: String,
      required: [true, "color is required"],
    },
    images: {
      type: Array,
    },
    sold: {
      type: Number,
      default: 0,
      //   select: false,  //hide from user
    },

    ratings: [
      {
        star: {
          type: Number,
        },
        comment: {
          type: String
        },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalratings: {
      type: String,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("Product", productSchema);
