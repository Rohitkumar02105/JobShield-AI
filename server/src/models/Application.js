import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, default: "Saved" },
    risk: { type: Number, default: 0 },
    notes: String
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);
