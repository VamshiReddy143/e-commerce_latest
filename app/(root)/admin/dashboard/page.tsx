"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    monthlySales: [],
    bestSellers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        toast.error("Error fetching analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
      className="p-4 sm:p-6 dark:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors duration-300"
    >
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          color="bg-green-300 text-green-600"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          color="bg-blue-300 text-blue-500"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          color="bg-violet-400 text-purple-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          color="bg-orange-400 text-orange-900"
        />
      </div>

      {/* Monthly Sales Chart */}
      <MonthlySalesGraph monthlySales={stats.monthlySales} />

      {/* Best Selling Products Chart */}
      <BestSellersChart bestSellers={stats.bestSellers} />
    </motion.div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, color }: { title: string; value: string | number; color: string }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${color} p-4 sm:p-6 rounded-lg shadow-lg text-center transition-transform duration-300 cursor-pointer`}
    >
      <h2 className="text-base sm:text-lg font-bold">{title}</h2>
      <p className="text-xl sm:text-2xl font-bold">{value}</p>
    </motion.div>
  );
};

// Monthly Sales Graph Component
const MonthlySalesGraph = ({ monthlySales }: { monthlySales: any[] }) => {
  const calculateGrowthRate = () => {
    if (monthlySales.length < 2) return 0;
    const currentMonth = monthlySales[monthlySales.length - 1]?.total || 0;
    const previousMonth = monthlySales[monthlySales.length - 2]?.total || 0;
    return previousMonth === 0 ? 0 : ((currentMonth - previousMonth) / previousMonth) * 100;
  };

  const growthRate = calculateGrowthRate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-300">Monthly Sales</h2>
        <span className={`text-sm sm:text-base font-medium ${growthRate >= 0 ? "text-green-500" : "text-red-500"}`}>
          {growthRate.toFixed(2)}% Growth
        </span>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={monthlySales} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="_id" tickFormatter={(month) => `Month ${month}`} stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Best Selling Products Chart Component
const BestSellersChart = ({ bestSellers }: { bestSellers: any[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-300">
          Best Selling Products
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={bestSellers}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="_id" stroke="#82ca9d" />
          <YAxis stroke="#82ca9d" />
          <Tooltip contentStyle={{ backgroundColor: "black", borderColor: "black",color:"white" }} />
          <Bar dataKey="totalSold" fill="url(#barGradient)" />
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default AdminDashboard;