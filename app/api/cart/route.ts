import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import mongoose from "mongoose";
import User from "@/models/user";
import dbConnect from "@/lib/mongodb";
import { authOptions } from "@/app/auth/authOptions";
import { ProductModel } from "@/models/Product";

export async function POST(req: Request) {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, size, quantity } = await req.json();
    if (!productId || !size || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

 
    let userId: string | mongoose.Types.ObjectId = session.user?.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        const existingUser = await User.findOne({ email: session.user.email }).select("_id");
        if (!existingUser) {
          return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        userId = existingUser._id;
      } else {
        userId = new mongoose.Types.ObjectId(userId);
      }

      const productData = await ProductModel.findById(productId);
      if (!productData) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      const price = productData.price;

      const existingCartItem = await Cart.findOne({ productId, userId, size });
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        await existingCartItem.save();
        return NextResponse.json({ message: "Product quantity updated in cart" }, { status: 200 });
      }

    const cartItem = new Cart({ productId, userId, size, quantity,price });
    await cartItem.save();

    return NextResponse.json({ message: "Added to cart successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



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
          return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        userId = existingUser._id;
      } else {
        userId = new mongoose.Types.ObjectId(userId);
      }

      const cartItems = await Cart.find({ userId }).populate("productId");
  
      return NextResponse.json(cartItems, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }