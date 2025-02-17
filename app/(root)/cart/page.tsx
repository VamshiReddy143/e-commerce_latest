"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import emptycart from "@/public/cart.png"
import Loader from "@/components/Loader";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  size: string;
  quantity: number;
  price: number;
}

const CartPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const discount = 10; 
  const deliveryFee = 50; 

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch cart items");
        const data = await res.json();
        setCart(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);


  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart }),
      });

      if (!res.ok) throw new Error("Failed to initiate checkout");

      const { sessionId } = await res.json();
      const stripe = await stripePromise;
      if (stripe) await stripe.redirectToCheckout({ sessionId });

    } catch (error) {
      toast.error("Failed to process checkout. Please try again.");
      console.error(error);
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!res.ok) throw new Error("Failed to update quantity");
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
      // window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Quantity updated");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (cartItemId: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove item");
      setCart((prevCart) => prevCart.filter((item) => item._id !== cartItemId));
      toast.success("Item removed");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  const subTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );
  const total = useMemo(() => subTotal - (subTotal * discount) / 100 + deliveryFee, [subTotal]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader/>
      </div>
    )
  }

  return (
    <div className="max-w-9xl  mx-auto p-6">
      <h1 className="text-3xl text-gray-900  font-bold mb-6">Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="flex items-center justify-center">
          <Image
          src={emptycart}
          alt="empty_cart"
          height={400}
          width={400}
          />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Cart Items Table */}
          <div className="flex-1">
            <div className="border rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-4">Product Code</th>
                    <th className="p-4 text-center">Quantity</th>
                    <th className="p-4 text-center">Total</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="p-4 flex items-center gap-4">
                        <Image
                          src={item.productId.images[0]}
                          alt={item.productId.name}
                          width={60}
                          height={60}
                          className="rounded-lg"
                        />
                        <div>
                          <h2 className="text-lg text-black font-semibold">{item.productId.name}</h2>
                          <p className="text-black">Size: {item.size}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="bg-black px-2 py-1 rounded-lg disabled:opacity-50"
                            disabled={updating}
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className=" text-black text-lg">{item.quantity}</span>
                          <button
                            className="bg-black px-2 py-1 rounded-lg disabled:opacity-50"
                            disabled={updating}
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-center text-red-400 text-lg font-bold">${item.price}</td>
                      <td className="p-4 text-center">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeItem(item._id)}
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:w-96 sm:h-fit border border-gray-700 rounded-lg p-6  shadow-sm">
            <h2 className="text-xl text-gray-900 font-bold mb-4">Order Summary</h2>
            <div className="flex text-gray-900  justify-between mb-2">
              <span>Sub Total</span>
              <span>${subTotal.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-gray-900  mb-2">
              <span>Discount ({discount}%)</span>
              <span>-${((subTotal * discount) / 100).toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-gray-900  mb-2">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-gray-900  font-bold text-lg mt-4">
              <span>Total</span>
              <span>${total.toFixed(2)} USD</span>
            </div>
            <button onClick={handleCheckout} className="bg-black text-white px-6 py-3 mt-4 rounded-lg w-full">
              Checkout Now
            </button>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default CartPage;
