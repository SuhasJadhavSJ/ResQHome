import mongoose from "mongoose";

const medicalEntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  note: String,
});

const RescuedSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String },
    age: { type: String },
    city: { type: String },
    description: { type: String },

    imageUrl: { type: String, required: true },

    rescuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // CORRECT
      required: true,
    },

    rescuedAt: { type: Date, default: Date.now },

    status: {
      type: String,
      enum: ["available", "adopted", "fostered"],
      default: "available",
    },

    meta: Object,
  },
  { timestamps: true }
);

export default mongoose.model("Rescued", RescuedSchema);
