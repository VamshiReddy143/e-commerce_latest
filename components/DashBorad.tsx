"use client";
import {  useState } from "react";
import AddProductForm from '@/components/AddProductForm';
import OrdersPage from "@/app/(root)/orders/page";
import AdminDashboard from "@/app/(root)/admin/dashboard/page";



const Analytics = () => {
  const [activeSection, setActiveSection] = useState("create"); // Track active section




  return (
    <div className="max-w-7xl mx-auto p-6 bg-white ">
      {/* Header */}
      <div className="flex gap-10">
      <h1
          onClick={() => setActiveSection("dashboard")}
          className={`text-4xl font-bold mb-6 cursor-pointer ${
            activeSection === "dashboard"
              ? "text-black border-b-4 border-red-400"
              : "text-gray-700"
          }`}
        >
          DashBoard
        </h1>
        <h1
          onClick={() => setActiveSection("create")}
          className={`text-4xl font-bold mb-6 cursor-pointer ${
            activeSection === "create"
              ? "text-black border-b-4 border-red-400"
              : "text-gray-700"
          }`}
        >
          Create Product
        </h1>
        <h1
          onClick={() => setActiveSection("orders")}
          className={`text-4xl font-bold mb-6 cursor-pointer ${
            activeSection === "orders"
              ? "text-black border-b-4 border-red-400"
              : "text-gray-700"
          }`}
        >
          Orders
        </h1>
      </div>



     
      {activeSection === "dashboard" && <AdminDashboard/>  }
      {activeSection === "create" && <AddProductForm />} 
      {activeSection === "orders" && <OrdersPage />}  
    </div>
  );
};


export default Analytics
