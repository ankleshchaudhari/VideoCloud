//Stpes : Take user data → validate → connect to DB → check existing user → create new user → send response.

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectionToDatabase } from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const { email, password, name, username } = await request.json()

        if (!email || !password || !name || !username) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }

        //connect to database
        await connectionToDatabase()

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        const existingUsername = await User.findOne({ username })

        if (existingUsername) {
            return NextResponse.json({ error: "Username already taken" }, { status: 400 });
        }

        await User.create({ email, password, name, username })

        return NextResponse.json({ message: "User Registered Successfully" }, { status: 201 });
    }
    catch (error) {
        console.error("Registeration Error")
        return NextResponse.json({ error: "Failed to Register" }, { status: 400 });
    }
}