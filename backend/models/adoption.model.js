import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  animal: { type: mongoose.Schema.Types.ObjectId, ref: "AdoptionAnimal", required: true },
  status: {
  type: String,
  enum: ["pending", "in_process", "rejected", "adopted"],
  default: "pending",
},
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Adoption", adoptionSchema);
