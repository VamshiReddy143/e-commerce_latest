"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import headset from "@/public/earphone.png";
import Link from "next/link";

const BestSeller = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        
        // Shuffle the array and pick 8 random products
        const randomProducts = data.products
          .sort(() => 0.5 - Math.random()) // Shuffle array
          .slice(0, 8); // Get first 8 products
        
        setProducts(randomProducts);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="mt-[80px] text-black dark:text-white flex flex-col justify-center">
      {/* Title */}
      <div className="flex justify-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold">Best Seller Products</h1>
      </div>

      {/* Loading State */}
      {loading && <p className="text-center text-gray-500 mt-6">Loading products...</p>}

      {/* Error State */}
      {error && <p className="text-center text-red-500 mt-6">{error}</p>}

      {/* Product Grid */}
      <div className="mt-10 gap-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {/* Product Cards */}
        {products.length > 0 ? (
          products.map((product: any, index: number) => (
            <div key={index} className="flex flex-col items-center">
               <Link  href={`/pages/products/${product._id}`} passHref>
              <Image
                src={product.images?.[0] || headset} // Use product image or fallback
                alt={product.name}
                width={900}
                height={900}
                className="h-[200px] w-[200px] object-contain sm:h-[300px] sm:w-[300px] bg-gray-200 dark:bg-gray-700 p-6 sm:p-9 rounded-[30px] cursor-pointer"
              />
              {/* Details */}
              <div className="mt-4 text-center">
                <h2 className="font-bold text-lg sm:text-xl cursor-pointer">{product.name}</h2>
                <h1 className="font-bold text-2xl sm:text-3xl">${product.price}</h1>
              </div>
              </Link>
            </div>
          ))
        ) : (
          !loading && <p className="text-center text-gray-500 mt-6">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default BestSeller;
