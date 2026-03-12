import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    excerpt: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      default: []
    },
    platform: {
      type: String,
      default: ""
    },
    platformIcon: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);