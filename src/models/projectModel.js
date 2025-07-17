import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: String, required: true },
    description: { type: String },
    technologies: [{ type: String }],
    githubLink: { type: String },
    liveDemo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("projects", projectSchema);
