import mongoose, { Schema, Document, models } from "mongoose";

interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
  }[];
  totalAmount: number;
  status: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" }, 
  },
  { timestamps: true }
);

const Order = models.Order || mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
