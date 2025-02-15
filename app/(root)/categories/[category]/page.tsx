"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching from category:", category); // Debugging

        const res = await fetch(`/api/products/category/${category}`, { cache: "no-store" });

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        setError("Failed to load products");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (category) fetchProducts();
  }, [category]);

  if (loading) return <p className="text-black text-center mt-10">Loading...</p>;

  return (
    <div className="text-black p-10">
      <h1 className="text-3xl font-bold mb-6 capitalize">{category} Collection</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Link key={product._id} href={`/pages/products/${product._id}`} passHref>
              <div className="cursor-pointer p-5 bg-white rounded-xl shadow-md hover:shadow-xl transition">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="h-[200px] w-[200px] object-contain rounded-lg"
                />
                <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                <p className="text-xl font-semibold text-red-500">${product.price}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
