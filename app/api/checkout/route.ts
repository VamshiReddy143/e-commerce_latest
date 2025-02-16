import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";
import Order from "@/models/Order";
import Cart from "@/models/Cart";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItems } = await req.json();

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Construct line items for Stripe
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productId.name,
          images: [item.productId.images[0]],
        },
        unit_amount: Math.round(item.productId.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Ensure BASE_URL is defined
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not defined in environment variables.");
    }

    // Create a Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cart`,
    });

    // Save the order to the database
    const order = new Order({
      userId: session.user.id,
      items: cartItems.map((item: any) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        size: item.size,
        image: item.productId.images[0],
      })),
      totalAmount: cartItems.reduce(
        (acc: number, item: any) => acc + item.productId.price * item.quantity,
        0
      ),
      status: "Pending", // Default status
    });

    await order.save();

    // Clear the cart
    await Cart.deleteMany({ userId: session.user.id });

    return NextResponse.json({ sessionId: stripeSession.id });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);

    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}