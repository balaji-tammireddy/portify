import { connect } from "@/dbSetup/dbSetup";
import { NextRequest, NextResponse } from "next/server";
import Profile from "@/models/profileModel";
import Skill from "@/models/skillModel";
import Project from "@/models/projectModel";
import Experience from "@/models/experienceModel";
import Education from "@/models/educationModel";
import Certificate from "@/models/certificateModel";

connect();

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const profile = await Profile.findOne({ slug });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const userId = profile.userId;
    const skills = await Skill.find({ userId });
    const projects = await Project.find({ userId });
    const experience = await Experience.find({ userId });
    const education = await Education.find({ userId });
    const certificates = await Certificate.find({ userId });

    return NextResponse.json(
      {
        profile,
        skills,
        projects,
        experience,
        education,
        certificates,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}