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
import { FaDownload } from "react-icons/fa";

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

//   const exportToCSV = (data: any[], filename: string) => {
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       [
//         Object.keys(data[0]).join(","),
//         ...data.map((item) => Object.values(item).join(",")),
//       ].join("\n");

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `${filename}.csv`);
//     document.body.appendChild(link);
//     link.click();
//   };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-gray-300">
        Loading dashboard...
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors duration-300">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
        Admin Dashboard
      </h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
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
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, color }: { title: string; value: string | number; color: string }) => {
  return (
    <div
      className={`${color} p-6 rounded-lg shadow-sm text-center transition-transform duration-300 hover:scale-105`}
    >
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

// Monthly Sales Graph Component
const MonthlySalesGraph = ({ monthlySales }: { monthlySales: any[] }) => {
  // Calculate Growth Rate
  const calculateGrowthRate = () => {
    if (monthlySales.length < 2) return 0;
    const currentMonth = monthlySales[monthlySales.length - 1]?.total || 0;
    const previousMonth = monthlySales[monthlySales.length - 2]?.total || 0;
    return previousMonth === 0 ? 0 : ((currentMonth - previousMonth) / previousMonth) * 100;
  };

  const growthRate = calculateGrowthRate();

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Month {payload[0].payload._id}
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Revenue: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">Monthly Sales</h2>
        <div className="flex items-center gap-2 text-sm font-medium text-green-500">
          <span>{growthRate.toFixed(2)}% Growth</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-4 h-4 ${growthRate >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={growthRate >= 0 ? "M7 11l5-5m0 0l5 5m-5-5v12" : "M17 13l-5 5m0 0l-5-5m5 5V6"}
            />
          </svg>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlySales} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="_id"
            tickFormatter={(month) => `Month ${month}`}
            stroke="#8884d8"
            fontSize={12}
          />
          <YAxis stroke="#8884d8" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="total"
            stroke="url(#gradient)"
            strokeWidth={3}
            dot={{ fill: "#8884d8", r: 5 }}
            activeDot={{ r: 8, fill: "#8884d8", stroke: "#fff", strokeWidth: 2 }}
          />
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Best Selling Products Chart Component
const BestSellersChart = ({ bestSellers }: { bestSellers: any[] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
          Best Selling Products
        </h2>
      
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={bestSellers}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="_id" stroke="#82ca9d" fontSize={12} />
          <YAxis stroke="#82ca9d" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: "black", borderColor: "black" }} />
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
    </div>
  );
};

export default AdminDashboard;