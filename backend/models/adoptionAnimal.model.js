import mongoose from "mongoose";

const medicalSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  note: String,
});

const adoptionAnimalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String },
    age: { type: String },
    gender: { type: String },
    weight: { type: String },
    color: { type: String },

    description: { type: String },
    city: { type: String, required: true },
    address: { type: String, required: true },

    images: [{ type: String, required: true }], // local stored

    medicalHistory: [medicalSchema],
    vaccinated: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["available", "adopted"],
      default: "available",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("AdoptionAnimal", adoptionAnimalSchema);
