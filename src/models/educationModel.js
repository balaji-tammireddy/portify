import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    grade: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Education || mongoose.model("educations", educationSchema);
