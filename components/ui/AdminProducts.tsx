"use client";
import { useState } from "react";

import { Search } from "lucide-react";
import Image from "next/image";
import Loader from "../Loader";
import toast from "react-hot-toast";
import { useProducts } from "@/app/hooks/useProducts";

const AdminProducts = () => {
  const { products, loading, error,setProducts } = useProducts(1,"name");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(7);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Search Filtering
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 7);
  };

  // DELETE PRODUCT FUNCTION
  const handleDelete = async (productId: string) => {
   
    setDeleting(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      const updatedProducts = products.filter((product) => product._id !== productId);
      setProducts(updatedProducts);
      toast.success("Product deleted successfully!");

    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center mt-10">Error: {error}</p>;

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
        <input
          type="text"
          className="border p-2 rounded-lg w-full bg-white dark:bg-gray-700 dark:text-white focus:outline-none"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="text-gray-700 dark:text-white cursor-pointer" />
      </div>

      {/* Product List */}
      <div className="mt-8 space-y-6">
        {filteredProducts.slice(0, visibleCount).map((product) => (
          <div key={product._id} className="flex items-center gap-5 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <Image
              src={product.images[0]}
              alt="product"
              width={900}
              height={900}
              className="h-16 w-16 rounded-lg object-contain"
            />

            <div className="flex-1">
              <h1 className="font-bold dark:text-white">{product.name}</h1>
            </div>

            <button
              onClick={() => handleDelete(product._id)}
              disabled={deleting === product._id}
              className={`bg-red-600 text-white px-4 py-2 rounded-lg transition ${
                deleting === product._id ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
              }`}
            >
              {deleting === product._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredProducts.length && (
        <button
          onClick={handleLoadMore}
          className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg w-full font-semibold hover:bg-blue-600 transition"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default AdminProducts;
