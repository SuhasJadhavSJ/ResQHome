import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "animal", // we’ll create this model later
      required: true,
    },
    status: {
      type: String,
      enum: ["adopted", "pending"],
      default: "adopted",
    },
    adoptedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Adoption = mongoose.model("Adoption", adoptionSchema);
export default Adoption;
