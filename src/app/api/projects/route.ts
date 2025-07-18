import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbSetup/dbSetup";
import Project from "@/models/projectModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const projects = await Project.find({ userId });

    return NextResponse.json(
      { message: "Projects fetched successfully", data: projects },
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
    const { _id, project, description, technologies, githubLink, liveDemo } = reqBody;

    if (!project) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 });
    }

    if (_id) {
      const existing = await Project.findOne({ _id, userId });
      if (!existing) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      existing.project = project;
      existing.description = description;
      existing.technologies = technologies;
      existing.githubLink = githubLink;
      existing.liveDemo = liveDemo;

      const updated = await existing.save();
      return NextResponse.json({ message: "Project updated successfully", data: updated }, { status: 200 });
    }

    const newProject = new Project({
      userId,
      project,
      description,
      technologies,
      githubLink,
      liveDemo,
    });

    const saved = await newProject.save();
    return NextResponse.json({ message: "Project added successfully", data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID not provided" }, { status: 400 });
    }

    const deleted = await Project.findOneAndDelete({ _id: projectId, userId });

    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully", data: deleted }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
