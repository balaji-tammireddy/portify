import {connect} from "@/dbSetup/dbSetup";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {name, email, password} = reqBody;
        //validation
        if(!name || !email || !password){
            return NextResponse.json({error: "Please fill all the fields"}, {status: 400})
        }

        //check if user already exists
        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save();

        const tokendata = {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email
        }

        const token =  await jwt.sign(tokendata, process.env.TOKEN_SECRET!, {expiresIn: "1d"});
        const response = NextResponse.json({ message: "User created successfully", success: true}, { status: 200 })
        response.cookies.set("token",token,{httpOnly: true})

        return response

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}