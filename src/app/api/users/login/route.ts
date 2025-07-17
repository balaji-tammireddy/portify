import { connect } from "@/dbSetup/dbSetup";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        //validation
        if (!email || !password) {
            return NextResponse.json({ error: "Please fill all the fields" }, { status: 400 })
        }

        //check if user already exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 })
        }

        //check if password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 })
        }

        //create tokendata
        const tokendata = {
            id: user._id,
            name: user.name,
            email: user.email
        }

        //create token
        const token = await jwt.sign(tokendata, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

        const response = NextResponse.json({ message: "User logged in successfully", success: true}, { status: 200 })
        response.cookies.set("token", token, {httpOnly: true})

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}