import { connect } from "@/dbSetup/dbSetup";
import Certificate from "@/models/certificateModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const certificates = await Certificate.find({ userId });

    return NextResponse.json(
      { message: "Certificates fetched successfully", data: certificates },
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
      title,
      issuer,
      issueDate,
      description,
      certificateLink,
    } = reqBody;

    if (!title || !issuer || !issueDate) {
      return NextResponse.json(
        { error: "Title, Issuer, and Issue Date are required" },
        { status: 400 }
      );
    }

    if (_id) {
      const existing = await Certificate.findOne({ _id, userId });
      if (!existing) {
        return NextResponse.json(
          { error: "Certificate not found" },
          { status: 404 }
        );
      }

      existing.title = title;
      existing.issuer = issuer;
      existing.issueDate = issueDate;
      existing.description = description;
      existing.certificateLink = certificateLink;

      const updated = await existing.save();
      return NextResponse.json(
        { message: "Certificate updated successfully", data: updated },
        { status: 200 }
      );
    }

    const newCertificate = new Certificate({
      userId,
      title,
      issuer,
      issueDate,
      description,
      certificateLink,
    });

    const saved = await newCertificate.save();
    return NextResponse.json(
      { message: "Certificate added successfully", data: saved },
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
    const certificateId = searchParams.get("certificateId");

    if (!certificateId) {
      return NextResponse.json(
        { error: "Certificate ID not provided" },
        { status: 400 }
      );
    }

    const deleted = await Certificate.findOneAndDelete({
      _id: certificateId,
      userId,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Certificate deleted successfully", data: deleted },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}