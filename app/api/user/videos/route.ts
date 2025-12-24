import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import Video from "@/models/Video";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectionToDatabase();

    const videos = await Video.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
