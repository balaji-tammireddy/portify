import { connect } from "@/dbSetup/dbSetup";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Skill from "@/models/skillModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest){
    try {
        const userId = await getDataFromToken(request);
        const skills = await Skill.find({userId});

        if(!skills){
            return NextResponse.json({error: "No skills found"}, {status: 404})
        }

        return NextResponse.json({message: "Skills fetched successfully", data: skills}, {status: 200})
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const reqBody = await request.json();
    const { skill, level } = reqBody;

    if (!skill) {
      return NextResponse.json({ error: "Please fill all the fields" }, { status: 400 });
    }

    const newSkill = new Skill({
      userId,
      skill,
      level,
    });

    const savedSkill = await newSkill.save();
    return NextResponse.json({ message: "Skill added successfully", data: savedSkill }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest){
    try {
        const userId = await getDataFromToken(request);

        if(!userId){
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

        const {searchParams} = new URL(request.url);
        const skillId = searchParams.get("skillId");

        if(!skillId){
            return NextResponse.json({error: "Skill not found"}, {status: 404})
        }

        const deletedSkill = await Skill.findOneAndDelete({_id: skillId, userId});

        if(!deletedSkill){
            return NextResponse.json({error: "Skill not found"}, {status: 404})
        }

        return NextResponse.json({message: "Skill deleted successfully", data: deletedSkill}, {status: 200})
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}