// backend/models/adoptionListing.model.js
import mongoose from "mongoose";

const medicalEntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  note: { type: String, required: true },
});

const adoptionListingSchema = new mongoose.Schema(
  {
    rescuedRef: { type: mongoose.Schema.Types.ObjectId, ref: "Rescued" }, // optional link to rescued doc
    listedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: { type: String }, // Dog, Cat...
    breed: { type: String },
    age: { type: String },
    sex: { type: String, enum: ["male", "female", "unknown"], default: "unknown" },
    city: { type: String },
    address: { type: String },
    description: { type: String },
    images: [{ type: String }], // full URLs
    medicalHistory: [medicalEntrySchema],
    status: { type: String, enum: ["available", "adopted"], default: "available" },
    meta: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model("AdoptionListing", adoptionListingSchema);
