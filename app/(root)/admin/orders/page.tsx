"use client";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface Order {
  _id: string;
  userId: { name: string; email: string };
  items: {
    name: string;
    price: number;
    quantity: number;
    size: string;
  }[];
  totalAmount: number;
  status: string;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        toast.error("Error fetching orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update order status");

      const updatedOrder = await res.json();

      setOrders((prev) =>
        prev.map((o) =>
          o._id === updatedOrder._id ? { ...updatedOrder, userId: o.userId } : o
        )
      );

      toast.success("Order status updated!");
    } catch (error) {
      toast.error("Failed to update order.");
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) throw new Error("Failed to delete order");
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      toast.success("Order deleted.");
    } catch (error) {
      toast.error("Failed to delete order.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="sm:max-w-6xl text-gray-900 dark:text-white mx-auto sm:p-4 ">
      {/* Empty State */}
      {orders.length === 0 ? (
        <p className="text-gray-500 dark:text-white text-center">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-black p-4 sm:p-6 rounded-lg shadow-md"
            >
              {/* Order Summary */}
              <div
                onClick={() =>
                  setExpandedOrder(expandedOrder === order._id ? null : order._id)
                }
                className="cursor-pointer flex justify-between items-center border-b dark:border-gray-700 pb-3"
              >
                <div>
                  <p className="text-lg font-bold">Order ID: {order._id}</p>
                  <p className="text-gray-600 dark:text-white">
                    {order.userId.name} ({order.userId.email})
                  </p>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      order.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : order.status === "Shipped"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Details (Expandable) */}
              {expandedOrder === order._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <p className="text-gray-700 dark:text-white font-semibold">Order Items:</p>
                  <ul className="mt-2 space-y-2">
                    {order.items.map((item, index) => (
                      <li
                        key={index}
                        className="border-b dark:border-gray-600 pb-2 flex justify-between text-sm"
                      >
                        <span>{item.name} (Size: {item.size})</span>
                        <span>${item.price} × {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-900 dark:text-white font-bold mt-3">
                    Total: ${order.totalAmount.toFixed(2)}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-3 space-y-0  sm:flex gap-4  sm:justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => updateOrderStatus(order._id, "Shipped")}
                      className="bg-blue-500 text-white px-3 py-2 rounded-lg w-full  sm:w-auto"
                    >
                      Mark as Shipped
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => updateOrderStatus(order._id, "Delivered")}
                      className="bg-green-500 text-white px-3 py-2 rounded-lg w-full  sm:w-auto"
                    >
                      Mark as Delivered
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => deleteOrder(order._id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg w-full  sm:w-auto"
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;