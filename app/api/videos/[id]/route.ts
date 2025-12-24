import { connectionToDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Video from "@/models/Video";

export const dynamic = "force-dynamic";

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await connectionToDatabase();
        const params = await props.params;
        const { id } = params;
        const video = await Video.findById(id).lean();

        if (!video) {
            return NextResponse.json(
                { error: "Video not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(video);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch video" },
            { status: 500 }
        );
    }
}
