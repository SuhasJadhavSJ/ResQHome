import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    imageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "rescued"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
