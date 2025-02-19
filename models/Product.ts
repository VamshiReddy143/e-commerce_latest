// models/Product.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IReview {
  user: Types.ObjectId;
  rating: number; 
  comment: string; 
  createdAt: Date; 
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  sizes?: string[];
  images: string[];
  reviews: IReview[]; 
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
  sizes: { type: [String], default: [] },
  images: { type: [String], required: true },
  reviews: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export const ProductModel = mongoose.model<IProduct>("Product", productSchema);