"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/Loader";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    )
  }

  return (
    <div className="text-black p-10">
      <h1 className="text-3xl font-bold mb-6 capitalize">{category} Collection</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Link key={product._id} href={`/pages/products/${product._id}`} passHref>
              <div className="cursor-pointer bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-2xl transition">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={200}
                  height={200}
                  loading="lazy"
                  className="bg-gray-100 dark:bg-transparent p-5 h-[300px] w-[300px] object-contain rounded-xl"
                />
                <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                <p className="text-xl font-semibold text-red-500">${product.price}</p>


                <div className="flex items-center mt-2">
                  {product.reviews?.length > 0 ? (
                    <>
                      {/* Compute average rating */}
                      {(() => {
                        const avgRating =
                          product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

                        const fullStars = Math.floor(avgRating); // Number of full stars
                        const halfStar = avgRating % 1 >= 0.5 ? 1 : 0; // Half star condition
                        const emptyStars = 5 - fullStars - halfStar; // Remaining empty stars

                        return (
                          <p className="text-yellow-500 text-2xl flex">
                            {"⭐".repeat(fullStars)}
                            {halfStar ? "⭐" : ""}
                            {"☆".repeat(emptyStars)}
                          </p>
                        );
                      })()}
                      <p className="ml-2 text-gray-700 dark:text-gray-300 text-lg">
                        ({product.reviews?.length})
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-2xl">{"☆".repeat(5)}</p> // Empty stars when no reviews
                  )}
                </div>

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
