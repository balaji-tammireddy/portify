import { connect } from "@/dbSetup/dbSetup";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Profile from "@/models/profileModel";

connect();

export async function GET(request: NextRequest) {
  try {
    // console.log("Incoming GET /api/profile request");
    const userId = await getDataFromToken(request);
    // console.log("Extracted userId from token:", userId);

    const profile = await Profile.findOne({ userId });
    // console.log("Profile found:", profile);

    if (!profile) {
    //   console.log("No profile found for user");
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Profile fetched successfully", data: profile },
      { status: 200 }
    );
  } catch (error: any) {
    // console.error("Error in GET /api/profile:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // console.log("Incoming POST /api/profile request");
    const userId = await getDataFromToken(request);
    // console.log("Extracted userId from token:", userId);

    if (!userId) {
    //   console.log("userId missing");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const reqBody = await request.json();
    // console.log("Request body:", reqBody);
    const { fullName, title, location, bio, phone, email, linkedin, github, website } = reqBody;

    const profile = await Profile.findOne({ userId });
    if (profile) {
    //   console.log("Updating existing profile");
      profile.fullName = fullName || profile.fullName;
      profile.title = title || profile.title;
      profile.location = location || profile.location;
      profile.bio = bio || profile.bio;
      profile.phone = phone || profile.phone;
      profile.email = email || profile.email;
      profile.linkedin = linkedin || profile.linkedin;
      profile.github = github || profile.github;
      profile.website = website || profile.website;

      const updated = await profile.save();
    //   console.log("Profile updated:", updated);

      return NextResponse.json(
        { message: "Profile updated successfully", data: updated },
        { status: 200 }
      );
    }

    if (!fullName) {
    //   console.log("Full name missing in request body");
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    // console.log("Creating new profile");
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
    });

    const savedProfile = await newProfile.save();
    // console.log("New profile saved:", savedProfile);

    return NextResponse.json(
      { message: "Profile created successfully", data: savedProfile },
      { status: 200 }
    );
  } catch (error: any) {
    // console.error("Error in POST /api/profile:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}