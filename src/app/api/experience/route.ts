import {connect} from "@/dbSetup/dbSetup";
import Experience from "@/models/experienceModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest){
    try {
        const userId = await getDataFromToken(request);
        const experience = await Experience.find({userId});

        if(!experience){
            return NextResponse.json({error: "No experience found"}, {status: 404})
        }

        return NextResponse.json({message: "Experience fetched successfully", data: experience}, {status: 200})
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
        const {company, position, startDate, endDate, description} = reqBody;

        const experience = await Experience.findOne({userId});
        if(experience){
            experience.company = company || experience.company;
            experience.position = position || experience.position;
            experience.startDate = startDate || experience.startDate;
            experience.endDate = endDate || experience.endDate;
            experience.description = description || experience.description;

            const updatedExperience = await experience.save();
            return NextResponse.json({message: "Experience updated successfully", data: updatedExperience}, {status: 200})
        }

        if(!company || !position || !startDate){
            return NextResponse.json({error: "Please fill all the fields"}, {status: 400})
        }

        const newExperience = new Experience({
            userId,
            company,
            position,
            startDate,
            endDate,
            description
        })

        const savedExperience = await newExperience.save();
        return NextResponse.json({message: "Experience added successfully", data: savedExperience}, {status: 200})
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);

        if(!userId){
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

        const {searchParams} = new URL(request.url);
        const experienceId = searchParams.get("experienceId");

        if(!experienceId){
            return NextResponse.json({error: "Experience not found"}, {status: 404})
        }

        const deletedExperience = await Experience.findOneAndDelete({_id: experienceId, userId});

        if(!deletedExperience){
            return NextResponse.json({error: "Experience not found"}, {status: 404})
        }

        return NextResponse.json({message: "Experience deleted successfully", data: deletedExperience}, {status: 200})
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}