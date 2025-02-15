import { NextRequest, NextResponse } from "next/server";
import { ProductModel } from "@/models/Product";
import dbConnect from "@/lib/mongodb";

export async function GET(req: NextRequest, { params }: { params: { category?: string } }) {
  try {
    await dbConnect();
    
    console.log("Received params:", params); // Debugging

    if (!params?.category) {
      return NextResponse.json({ message: "Category is required" }, { status: 400 });
    }

    const { category } = params;

    // Validate category
    const validCategories = ["watches", "headphones", "laptops", "gaming", "futuristic", "soundbar"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ message: "Invalid category" }, { status: 400 });
    }

    // Fetch products by category
    const products = await ProductModel.find({ category });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
