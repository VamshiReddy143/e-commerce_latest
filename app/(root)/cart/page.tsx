"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import emptycart from "@/public/cart.png";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";
import BestSeller from "@/components/BestSeller";

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

  const subTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  const total = useMemo(() => subTotal - (subTotal * discount) / 100 + deliveryFee, [subTotal]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }} 
      className="  mx-auto p-6"
    >
      

      {cart.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-center">
            <Image src={emptycart} alt="empty_cart" height={400} width={400} />
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col   lg:flex-row gap-8">
          <motion.div className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
            <div className="border dark:border-gray-500   rounded-lg shadow-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4 text-center">Quantity</th>
                    <th className="p-4 text-center">Total</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id} className="border-t dark:border-gray-500 ">
                      <td className="p-4 flex items-center gap-4">
                        <Image src={item.productId.images[0]} alt={item.productId.name} width={60} height={60} className="rounded-lg" />
                        <div>
                          <h2 className="text-lg font-semibold">{item.productId.name}</h2>
                          <p className="text-sm text-gray-600">Size: {item.size}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-lg" disabled={updating} onClick={() => updateQuantity(item._id, item.quantity - 1)}> - </button>
                          <span className="text-lg">{item.quantity}</span>
                          <button className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-lg" disabled={updating} onClick={() => updateQuantity(item._id, item.quantity + 1)}> + </button>
                        </div>
                      </td>
                      <td className="p-4 text-center text-lg font-bold text-red-500">${item.price}</td>
                      <td className="p-4 text-center">
                        <button className="text-red-500 hover:text-red-700" onClick={() => removeItem(item._id)}>
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="lg:w-80 p-6 border dark:border-gray-500 flex flex-col gap-2 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <p>Subtotal: <strong>${subTotal.toFixed(2)}</strong></p>
            <p>Discount: <strong>-${((subTotal * discount) / 100).toFixed(2)}</strong></p>
            <p>Delivery Fee: <strong>${deliveryFee}</strong></p>
            <p className="text-lg font-bold mt-3">Total: <strong>${total.toFixed(2)}</strong></p>
            <button className="bg-black text-white dark:bg-gray-700 rounded-xl px-4 py-2 w-full mt-4 " onClick={handleCheckout}>Checkout</button>
          </motion.div>
        </div>
      )}

      <div>
        <BestSeller/>
      </div>
      <Toaster />
    </motion.div>
  );
};

export default CartPage;
