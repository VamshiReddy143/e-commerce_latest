"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
      setOrders((prev) => prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)));
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

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="max-w-6xl text-gray-900 mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg">
              <p className="text-lg font-bold">Order ID: {order._id}</p>
              <p>User: {order.userId.name} ({order.userId.email})</p>
              <p>Total: ${order.totalAmount.toFixed(2)}</p>
              <p>Status: <span className="font-bold">{order.status}</span></p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => updateOrderStatus(order._id, "Shipped")}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                >
                  Mark as Shipped
                </button>
                <button
                  onClick={() => updateOrderStatus(order._id, "Delivered")}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg"
                >
                  Mark as Delivered
                </button>
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
