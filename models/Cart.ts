import mongoose, { Schema, model, models, Document } from "mongoose";


interface ICart extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  size: string;
  quantity: number;
  createdAt: Date;
  price: number;
}


const CartSchema = new Schema<ICart>(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);


const Cart = models.Cart || model<ICart>("Cart", CartSchema);
export default Cart;
