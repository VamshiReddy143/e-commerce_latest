import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { ProductModel } from "@/models/Product";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, description, price, category, sizes, images } = body;

    if (!name || !description || !price || !category || !images?.length) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      images.map(async (image: string) => {
        const result = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
        return result.secure_url;
      })
    );

    // Save product to MongoDB
    const product = new ProductModel({
      name,
      description,
      price,
      category,
      sizes: sizes || [],
      images: imageUrls,
    });

    await product.save();

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}



export async function GET(req:Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    let filter = {};
    if (query) {
      filter = { name: { $regex: query, $options: "i" } }; // Case-insensitive search
    }
    const products = await ProductModel.find(filter).select("name reviews price images");
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}