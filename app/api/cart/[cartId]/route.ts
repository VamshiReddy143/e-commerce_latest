import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Cart from "@/models/Cart";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import User from "@/models/user";
import cloudinary from "@/lib/cloudinary";
import { ProductModel } from "@/models/Product";




export async function PUT(req: NextRequest, context: { params:Promise<{ cartId: string }> }) {
  const params  = await context.params;
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let userId = session.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const existingUser = await User.findOne({ email: session.user.email }).select("_id");
      if (!existingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      userId = existingUser._id.toString();
    }

    if (!mongoose.Types.ObjectId.isValid(params.cartId)) {
      return NextResponse.json({ error: "Invalid cart ID" }, { status: 400 });
    }

    const { quantity } = await req.json();

    const cartItem = await Cart.findOneAndUpdate(
      { _id: params.cartId, userId: userId },
      { $set: { quantity } },
      { new: true }
    );
    if (!cartItem) {
      return NextResponse.json({ error: "Item not found for this user" }, { status: 404 });
    }
    return NextResponse.json({ message: "Cart updated", cartItem }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params:Promise<{ cartId: string }> }) {
  const params  = await context.params;
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let userId = session.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const existingUser = await User.findOne({ email: session.user.email }).select("_id");
      if (!existingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      userId = existingUser._id.toString();
    }

    if (!mongoose.Types.ObjectId.isValid(params.cartId)) {
      return NextResponse.json({ error: "Invalid cart ID" }, { status: 400 });
    }

    const cartItem = await Cart.findOne({ _id: params.cartId, userId: userId }).populate("productId");
    if (!cartItem) {
      return NextResponse.json({ error: "Item not found for this user" }, { status: 404 });
    }

    const product = await ProductModel.findById(cartItem.productId);
    if (product && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const publicId = imageUrl.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted image from Cloudinary: ${publicId}`);
        }
      }
    }

    // Delete the cart item from MongoDB
    await Cart.findByIdAndDelete(params.cartId);
    return NextResponse.json({ message: "Item and associated image removed successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}