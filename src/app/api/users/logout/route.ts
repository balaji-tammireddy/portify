import {NextResponse} from "next/server";

export async function POST(){
    try {
        const response = NextResponse.json({message: "User logged out successfully"}, {status: 200})
        response.cookies.set("token", "", {httpOnly: true, expires: new Date(0)});
        return response
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
} 