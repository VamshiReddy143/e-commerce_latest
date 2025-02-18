
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

    const product = await ProductModel.findById(id).populate("reviews.user", "name image");
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product.reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


// app/api/products/[id]/reviews/route.ts
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      await dbConnect();
      
      const { id } = params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
      }
  
      const body = await req.json();
      const { userId, rating, comment } = body;
  
      if (!userId || !rating || !comment) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
  
      const product = await ProductModel.findById(id);
      if (!product) {
        return NextResponse.json({ message: "Product not found" }, { status: 404 });
      }
  
   
      const existingReview = product.reviews.find((review) => review.user.toString() === userId);
      if (existingReview) {
        return NextResponse.json({ message: "You have already reviewed this product" }, { status: 400 });
      }
  
      // Add the new review
      product.reviews.push({
        user: userId,
        rating: parseInt(rating),
        comment,
      });
  
      await product.save();
  
      return NextResponse.json({ message: "Review added successfully" }, { status: 201 });
    } catch (error) {
      console.error("Error adding review:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }