import { connect } from "@/dbSetup/dbSetup";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import Profile from "@/models/profileModel";
import Skill from "@/models/skillModel";
import Project from "@/models/projectModel";
import Experience from "@/models/experienceModel";
import Education from "@/models/educationModel";
import Certificate from "@/models/certificateModel";

await connect();

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ success: false, message: "Username is required" }, { status: 400 });
    }

    const user = await User.findOne({ name: username });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      return NextResponse.json({ success: false, message: "Profile not found" }, { status: 404 });
    }

    const [skills, projects, experience, education, certificates] = await Promise.all([
      Skill.find({ userId: user._id }),
      Project.find({ userId: user._id }),
      Experience.find({ userId: user._id }),
      Education.find({ userId: user._id }),
      Certificate.find({ userId: user._id }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        skills,
        projects,
        experience,
        education,
        certificates,
      },
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
