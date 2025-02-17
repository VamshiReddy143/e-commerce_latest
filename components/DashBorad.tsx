"use client";
import { useState, Suspense, lazy } from "react";
import Loader from "@/components/Loader";

// Lazy load components
const AdminDashboard = lazy(() => import("@/app/(root)/admin/dashboard/page"));
const AddProductForm = lazy(() => import("@/components/AddProductForm"));
const AdminOrdersPage = lazy(() => import("@/app/(root)/admin/orders/page"));

const Analytics = () => {
  const [activeSection, setActiveSection] = useState("dashboard"); // Track active section

  // Define sections dynamically
  const sections = [
    { name: "Dashboard", value: "dashboard" },
    { name: "Create ", value: "create" },
    { name: "Orders", value: "orders" },
  ];

  return (
    <div className="dark:text-white mx-auto p-6">
      {/* Header */}
      <div className="flex gap-10 overflow-x-auto sm:flex-wrap">
        {sections.map((section) => (
          <h1
            key={section.value}
            onClick={() => setActiveSection(section.value)}
            className={`text-2xl sm:text-4xl font-bold mb-6 cursor-pointer transition-colors duration-300 ${
              activeSection === section.value
                ? "border-b-4 border-red-400 text-red-400"
                : "text-gray-600 hover:text-gray-800 dark:hover:text-gray-300"
            }`}
          >
            {section.name}
          </h1>
        ))}
      </div>

      {/* Content */}
      <Suspense fallback={<Loader />}>
        {activeSection === "dashboard" && <AdminDashboard />}
        {activeSection === "create" && <AddProductForm />}
        {activeSection === "orders" && <AdminOrdersPage />}
      </Suspense>
    </div>
  );
};

export default Analytics;