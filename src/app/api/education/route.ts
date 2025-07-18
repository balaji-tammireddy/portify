import { connect } from "@/dbSetup/dbSetup";
import Education from "@/models/educationModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const education = await Education.find({ userId });

    return NextResponse.json(
      { message: "Education fetched successfully", data: education },
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
    const {
      _id, 
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      grade,
    } = reqBody;

    if (!institution || !degree || !fieldOfStudy || !startDate || !grade) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 400 }
      );
    }

    if (_id) {
      const education = await Education.findOne({ _id, userId });
      if (!education) {
        return NextResponse.json(
          { error: "Education entry not found" },
          { status: 404 }
        );
      }

      education.institution = institution;
      education.degree = degree;
      education.fieldOfStudy = fieldOfStudy;
      education.startDate = startDate;
      education.endDate = endDate;
      education.grade = grade;

      const updated = await education.save();
      return NextResponse.json(
        { message: "Education updated successfully", data: updated },
        { status: 200 }
      );
    }

    const newEducation = new Education({
      userId,
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      grade,
    });

    const saved = await newEducation.save();
    return NextResponse.json(
      { message: "Education added successfully", data: saved },
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
    const educationId = searchParams.get("educationId");

    if (!educationId) {
      return NextResponse.json(
        { error: "Education ID not provided" },
        { status: 400 }
      );
    }

    const deleted = await Education.findOneAndDelete({ _id: educationId, userId });

    if (!deleted) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Education deleted successfully", data: deleted },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}