
import {  NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import { authOptions } from "@/app/auth/authOptions";


export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    let userId: string | mongoose.Types.ObjectId = session.user.id;
  


    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const existingUser = await User.findOne({ email: session.user.email }).select("_id");
      if (!existingUser) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      }
      userId = existingUser._id;
    } else {
      userId = new mongoose.Types.ObjectId(userId);
    }

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 401 });
  }
}
