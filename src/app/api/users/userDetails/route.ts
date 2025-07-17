import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbSetup/dbSetup";
import { json } from "stream/consumers";

connect();

export async function POST(request: NextRequest){
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findById(userId).select("-__v -password");
        return NextResponse.json({message: "User details fetched successfully", data: user}, {status: 200})
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}