import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    title: { type: String },
    location: { type: String },
    bio: { type: String },
    phone: { type: String },
    email: { type: String },
    linkedin: { type: String },
    github: { type: String },
    website: { type: String },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Profile = mongoose.models.profiles || mongoose.model("profiles", profileSchema);
export default Profile;
