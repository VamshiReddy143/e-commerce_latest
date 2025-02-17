"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const OrdersPage = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  if (!session?.user) {
    return <p className="text-center text-gray-500 mt-10">Please log in to view your orders.</p>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader/>
      </div>
    )
  }

  if (orders.length === 0) {
    return <p className="text-center text-gray-500 mt-10">You have no orders yet.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl text-gray-900 font-bold mb-6">My Orders</h1>
      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-700">
                Order Placed:{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-lg font-semibold text-red-500">
                Total: ${order.totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg text-gray-700 font-bold">{item.name}</h3>
                    <p className="text-gray-600">Size: {item.size}</p>
                    <p className="text-gray-600">
                      Quantity: {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p
                className={`text-lg ${
                  order.status === "Pending"
                    ? "text-yellow-500"
                    : order.status === "Shipped"
                    ? "text-blue-500"
                    : "text-green-500"
                }`}
              >
                Status: {order.status}
              </p>
              <Link href={`/orders/${order._id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
