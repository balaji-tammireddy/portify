import { connect } from "@/dbSetup/dbSetup";
import Experience from "@/models/experienceModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const experience = await Experience.find({ userId });

    return NextResponse.json(
      { message: "Experience fetched successfully", data: experience },
      { status: 200 }
    );
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
    const { _id, company, position, startDate, endDate, description } = reqBody;

    if (!company || !position || !startDate) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 400 }
      );
    }

    if (_id) {
      const experience = await Experience.findOne({ _id, userId });
      if (!experience) {
        return NextResponse.json(
          { error: "Experience entry not found" },
          { status: 404 }
        );
      }

      experience.company = company;
      experience.position = position;
      experience.startDate = startDate;
      experience.endDate = endDate;
      experience.description = description;

      const updated = await experience.save();
      return NextResponse.json(
        { message: "Experience updated successfully", data: updated },
        { status: 200 }
      );
    }

    const newExperience = new Experience({
      userId,
      company,
      position,
      startDate,
      endDate,
      description,
    });

    const saved = await newExperience.save();
    return NextResponse.json(
      { message: "Experience added successfully", data: saved },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const { searchParams } = new URL(request.url);
    const experienceId = searchParams.get("experienceId");

    if (!experienceId) {
      return NextResponse.json(
        { error: "Experience ID not provided" },
        { status: 400 }
      );
    }

    const deleted = await Experience.findOneAndDelete({
      _id: experienceId,
      userId,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Experience deleted successfully", data: deleted },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}