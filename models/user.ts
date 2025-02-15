import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; 
  isAdmin: boolean;
  cart: Types.ObjectId[];
  image: string;
  googleId?: string;
}

const userSchema = new Schema<IUser>({
  googleId: { type: String, unique: true, sparse: true },
  image: { type: String, default: "" },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, 
  isAdmin: { type: Boolean, default: false },
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
  ],
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
