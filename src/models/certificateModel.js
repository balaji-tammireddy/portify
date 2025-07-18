import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    issueDate: { type: Date, required: true },
    description: { type: String},
    certificateLink: { type: String},
  },
  { timestamps: true }
);

const Certificate = mongoose.models.certificates || mongoose.model("certificates", certificateSchema);

export default Certificate