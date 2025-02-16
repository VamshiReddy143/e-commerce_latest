"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";


interface Product{
  _id: string;
  name: string;
  price:number;
  images: string[]
}


const useProducts = ()=>{
  const [products,setProducts]=useState<Product[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);

  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";


  

  useEffect(()=>{
    const fetchProducts=async()=>{
      try {
        const res = await fetch(`/api/products?q=${query}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        setError((error as Error).message);
      }finally{
        setLoading(false);
      }
    }
    fetchProducts()
  },[query])

  return {products,loading,error}
}

const Page = () => {
  const {products,loading,error}=useProducts();


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader/>
      </div>
    )
  }
  if (error)
    return <p className="text-red-500 text-center mt-10">Error: {error}</p>;

  return (
    <div className="text-black flex flex-wrap gap-10">
      {products.map((product) => (
        <Link key={product._id} href={`/pages/products/${product._id}`} passHref>
          <div className="cursor-pointer bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition">
            <Image
              className="bg-gray-100 p-5 h-[300px] w-[300px] object-contain rounded-xl"
              src={product.images[0]}
              width={400}
              height={400}
              loading="lazy"
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
