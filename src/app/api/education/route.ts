import {connect} from "@/dbSetup/dbSetup";
import Education from "@/models/educationModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest){
    try {
        const userId = await getDataFromToken(request);
        const education = await Education.find({userId});

        if(!education){
            return NextResponse.json({error: "No education found"}, {status: 404})
        }

        return NextResponse.json({message: "Education fetched successfully", data: education}, {status: 200})
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
        const {institution, degree, fieldOfStudy, startDate, endDate, grade} = reqBody;

        const education = await Education.findOne({userId});
        if(education){
            education.institution = institution || education.institution;
            education.degree = degree || education.degree;
            education.fieldOfStudy = fieldOfStudy || education.fieldOfStudy;
            education.startDate = startDate || education.startDate;
            education.endDate = endDate || education.endDate;
            education.grade = grade || education.grade;

            const updatedEducation = await education.save();
            return NextResponse.json({message: "Education updated successfully", data: updatedEducation}, {status: 200})
        }

        if(!institution || !degree || !fieldOfStudy || !startDate || !grade){
            return NextResponse.json({error: "Please fill all the fields"}, {status: 400})
        }

        const newEducation = new Education({
            userId,
            institution,
            degree,
            fieldOfStudy,
            startDate,
            endDate,
            grade
        })

        const savedEducation = await newEducation.save();
        return NextResponse.json({message: "Education added successfully", data: savedEducation}, {status: 200})
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
        const educationId = searchParams.get("educationId");

        if(!educationId){
            return NextResponse.json({error: "Education not found"}, {status: 404})
        }

        const deletedEducation = await Education.findOneAndDelete({_id: educationId, userId});

        if(!deletedEducation){
            return NextResponse.json({error: "Education not found"}, {status: 404})
        }

        return NextResponse.json({message: "Education deleted successfully", data: deletedEducation}, {status: 200})
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}