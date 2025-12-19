import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import User from "@/models/User";

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

    const user = await User.findById(session.user?.id).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectionToDatabase();

    const body = await request.json();
    const { name, profilePhoto } = body;

    const updateData: { name?: string; profilePhoto?: string } = {};
    if (name !== undefined) updateData.name = name;
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;

    const user = await User.findByIdAndUpdate(
      session.user?.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

