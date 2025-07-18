import { connect } from "@/dbSetup/dbSetup";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Profile from "@/models/profileModel";
import { slugify } from "@/lib/utils";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Profile fetched successfully", data: profile }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const reqBody = await request.json();
    const { fullName, title, location, bio, phone, email, linkedin, github, website } = reqBody;
    const slug = slugify(fullName);

    const profile = await Profile.findOne({ userId });
    if (profile) {
      profile.fullName = fullName || profile.fullName;
      profile.title = title || profile.title;
      profile.location = location || profile.location;
      profile.bio = bio || profile.bio;
      profile.phone = phone || profile.phone;
      profile.email = email || profile.email;
      profile.linkedin = linkedin || profile.linkedin;
      profile.github = github || profile.github;
      profile.website = website || profile.website;
      profile.slug = slug; // ✅ update slug too
      const updated = await profile.save();
      return NextResponse.json({ message: "Profile updated successfully", data: updated }, { status: 200 });
    }

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    const newProfile = new Profile({
      userId,
      fullName,
      title,
      location,
      bio,
      phone,
      email,
      linkedin,
      github,
      website,
      slug,
    });

    const savedProfile = await newProfile.save();
    return NextResponse.json({ message: "Profile created successfully", data: savedProfile }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
