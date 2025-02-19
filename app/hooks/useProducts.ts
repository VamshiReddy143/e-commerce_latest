"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  reviews: { rating: number }[];
  rating: number;
}

export const useProducts = (page: number, sortBy: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products?q=${query}&page=${page}&limit=12&sort=${sortBy}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query, page, sortBy]);

  return { products, loading, error, setProducts };
}