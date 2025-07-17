import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skill: { type: String, required: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  },
  { timestamps: true }
);

export default mongoose.models.Skill || mongoose.model("skills", skillSchema);
