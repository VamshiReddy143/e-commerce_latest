import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import User from "@/models/user";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminUser = await User.findById(session.user.id);
  if (!adminUser || !adminUser.isAdmin) {
    return NextResponse.json({ error: "Access Denied" }, { status: 403 });
  }

  const orders = await Order.find().populate("userId", "name email").sort({createdAt:-1})
  return NextResponse.json(orders);
}


export async function PUT(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminUser = await User.findById(session.user.id);
  if (!adminUser || !adminUser.isAdmin) {
    return NextResponse.json({ error: "Access Denied" }, { status: 403 });
  }

  const { orderId, status } = await req.json();
  if (!orderId || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  return NextResponse.json(updatedOrder);
}


export async function DELETE(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminUser = await User.findById(session.user.id);
  if (!adminUser || !adminUser.isAdmin) {
    return NextResponse.json({ error: "Access Denied" }, { status: 403 });
  }

  const { orderId } = await req.json();
  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  await Order.findByIdAndDelete(orderId);
  return NextResponse.json({ message: "Order deleted successfully" });
}
