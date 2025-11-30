//Stpes : Take user data → validate → connect to DB → check existing user → create new user → send response.

import {NextRequest , NextResponse}from "next/server";
import User from "@/models/User";
import {connectionToDatabase} from "@/lib/db";

export async function POST(request:NextRequest)
{
    try{
        const {email , password}= await request.json()

        if(!email || !password)
        {
            return NextResponse.json({error: "Email and Password are required"}, {status:400})
        }

        //connect to database
        await connectionToDatabase()

        const existingUser=await User.findOne({email})

        if(existingUser)
        {
            return NextResponse.json({error: "User already exists"}, {status:400});
        }

        await User.create({email, password})

        return NextResponse.json({message:"User Registered Successfully"},{status:400});
    }
    catch(error)
    {
        console.error("Registeration Error")
        return NextResponse.json({error: "Failed to Register"}, {status:400});
    }
}