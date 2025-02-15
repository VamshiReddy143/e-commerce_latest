"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products", {
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="text-black flex flex-wrap gap-10">
      {products.map((product) => (
        <Link key={product._id} href={`/pages/products/${product._id}`} passHref>
          <div className="cursor-pointer bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition">
            <Image
              className="bg-gray-100 p-5 h-[300px] w-[300px] object-contain rounded-xl"
              src={product.images[0]}
              width={200}
              height={200}
              alt={product.name}
            />
            <h1 className="text-xl mt-2">{product.name}</h1>
            <p className="text-2xl font-bold mt-1">${product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Page;
