import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skill: { type: String, required: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  },
  { timestamps: true }
);

const Skill = mongoose.models.skills || mongoose.model("skills", skillSchema);

export default Skill