import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbSetup/dbSetup";
import Project from "@/models/projectModel";    
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest){
    try {
        const userId = await getDataFromToken(request);
        const projects = await Project.find({userId});

        if(!projects){
            return NextResponse.json({error: "No projects found"}, {status: 404})
        }

        return NextResponse.json({message: "Projects fetched successfully", data: projects}, {status: 200})
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function POST(request: NextRequest){
    try {
        const userId = await getDataFromToken(request);
        if(!userId){
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

        const reqBody = await request.json();
        const {project, description, technologies, githubLink, liveDemo} = reqBody;

        const projectDetails = await Project.findOne({userId});

        if(projectDetails){
            projectDetails.project = project || projectDetails.project;
            projectDetails.description = description || projectDetails.description;
            projectDetails.technologies = technologies || projectDetails.technologies;
            projectDetails.githubLink = githubLink || projectDetails.githubLink;
            projectDetails.liveDemo = liveDemo || projectDetails.liveDemo;
            
            const updatedProject = await projectDetails.save();
            return NextResponse.json({message: "Project updated successfully", data: updatedProject}, {status: 200})
        }


        if(!project){
            return NextResponse.json({error: "Please fill all the fields"}, {status: 400})
        }

        const newProject = new Project({
            userId,
            project,
            description,
            technologies,
            githubLink,
            liveDemo
        });

        const savedProject = await newProject.save();
        return NextResponse.json({message: "Project added successfully", data: savedProject}, {status: 200})
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function DELETE(request: NextRequest){
    try {
        const userId = await getDataFromToken(request);

        if(!userId){
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

        const {searchParams} = new URL(request.url);
        const projectId = searchParams.get("projectId");

        if(!projectId){
            return NextResponse.json({error: "Project not found"}, {status: 404})
        }

        const deletedProject = await Project.findOneAndDelete({_id: projectId, userId});

        if(!deletedProject){
            return NextResponse.json({error: "Project not found"}, {status: 404})
        }

        return NextResponse.json({message: "Project deleted successfully", data: deletedProject}, {status: 200})
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}