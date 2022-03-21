const mongoose = require("mongoose");


const createBlog = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    body: {
      type: String,
      trim: true,
    },
    authorId: {
      required: true,
      type: mongoose.Types.ObjectId,
      ref: "Author",
    },
    tags: [{ type: String, trim: true }],
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: [{ type: String, trim: true }],

    isDeleted: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blogs", createBlog);