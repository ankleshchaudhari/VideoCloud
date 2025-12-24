import { connectionToDatabase } from "@/lib/db";    // Import function to connect to MongoDB
import { NextRequest, NextResponse } from "next/server"; // Import request and response helpers for Next.js API routes
import { authOptions } from "@/lib/auth"; // Import NextAuth config
import { getServerSession } from "next-auth"; // Import function to read logged-in user session on server
import Video, { IVideo } from "@/models/Video"; // Import Video model(MongoDB model used to save/read data.) and its TypeScript interface (that tells what fields a video must have.)

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json([], { status: 200 });
        }
        await connectionToDatabase()
        const videos = await Video.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean() //find: get all videos from document, sort: newest first (-1 means descending order → newest first), lean: convert document into js objectsreturn plain JS objects

        // If no videos, send empty list
        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        // Send videos
        return NextResponse.json(videos)
    }
    catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch videos" },
            { status: 500 }
        );
    }
}


export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions) // Check if user is logged in

        // If not logged in, stop
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectionToDatabase()

        // Read data sent by client
        const body: IVideo = await request.json()

        // If any field missing, show error
        if (!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {
            return NextResponse.json(
                { error: "Missing required Fields" },
                { status: 400 }
            );
        }

        const videoData = {
            ...body,  //Spread Operator : Copy all fields from body into videoData (Once we copy frontend fields then can add extra fields via backend like transformation , controls...)
            controls: body?.controls ?? true, //if controls(Play,Pause..) present via body use it else then set controls

            // Set video size + quality
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100 //same logic w.r.t controls
            },
            userId: session.user.id
        };
        const newVideo = await Video.create(videoData)  // Save video in DB

        return NextResponse.json(newVideo) //return to frontend
    }
    catch (error) {
        return NextResponse.json(
            { error: "Failed to create video" },
            { status: 500 }
        );
    }
}