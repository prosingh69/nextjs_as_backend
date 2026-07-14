import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    profession: {
      type: String,
    },
    location: {
      type: String,
    },
    project: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
    },
    review: {
      type: String,
      required: [true, "Review is required"],
    },
    images: {
      type: [String], 
      default: [],   
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export default Review;