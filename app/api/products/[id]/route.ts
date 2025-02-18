import { NextRequest, NextResponse } from "next/server";
import { ProductModel } from "@/models/Product";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    const product = await ProductModel.findById(id).populate("reviews.rating")
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
