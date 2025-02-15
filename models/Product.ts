// models/Product.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string; // Use predefined categories
  sizes?: string[]; // Optional: For products like clothes or shoes
  images: string[]; // Array of image URLs
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ["watches", "headphones", "laptops", "gaming", "futuristic", "soundbar"],
    required: true,
  },
  sizes: { type: [String], default: [] }, // Optional field
  images: { type: [String], required: true },
});

export const ProductModel = mongoose.model<IProduct>("Product", productSchema);