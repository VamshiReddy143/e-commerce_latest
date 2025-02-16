import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Order from "@/models/Order";
import { authOptions } from "@/app/auth/authOptions";
import mongoose from "mongoose";
import User from "@/models/user";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId: string | mongoose.Types.ObjectId = session.user?.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const existingUser = await User.findOne({ email: session.user.email }).select("_id");
      if (!existingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      userId = existingUser._id;
    }

  
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
