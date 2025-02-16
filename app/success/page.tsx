"use client";
import { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SuccessPage() {
  useEffect(() => {
    // Clear the cart locally
    window.dispatchEvent(new Event("cartUpdated")); // Trigger a custom event to update the cart
    toast.success("Your cart has been cleared!");
  }, []);

  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold text-green-500">Payment Successful!</h1>
      <p className="mt-4 text-gray-700">Thank you for your purchase.</p>
      <Link href="/cart" className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-lg">
        Return to Cart
      </Link>
    </div>
  );
}