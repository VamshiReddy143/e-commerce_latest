"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/Loader";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  reviews: { rating: number }[];
}

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // const cachedData = localStorage.getItem(`products-${category}`);
      // if (cachedData) {
      //   setProducts(JSON.parse(cachedData));
      //   setLoading(false);
      //   return;
      // }
      const res = await fetch(`/api/products/category/${category}`, { cache: "no-store" });

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data);
      // localStorage.setItem(`products-${category}`, JSON.stringify(data));
    } catch (error) {
      setError("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [category])

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  const getRatingStars = useMemo(() => (reviews: { rating: number }[]) => {
    if (!reviews?.length) return "☆☆☆☆☆"; // Default empty stars

    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    const fullStars = Math.floor(avgRating);
    const halfStar = avgRating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return "⭐".repeat(fullStars) + (halfStar ? "⭐" : "") + "☆".repeat(emptyStars);
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" >
        <Loader />
      </div>
    )
  }




  return (
    <div className="text-black p-10">
      {/* <h1 className="text-3xl font-bold mb-6 capitalize">{category} Collection</h1> */}
      {error && (
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Link key={product._id} href={`/pages/products/${product._id}`} passHref legacyBehavior>
              <a aria-label={`View details for ${product.name}`} className="block">
                <div className="cursor-pointer bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-2xl transition">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    priority={true}
                    placeholder="blur"
                    blurDataURL="https://imgs.search.brave.com/Dwe3RRvsmgqv_lNOqfaBWV6Xg4H0PePpXZeQEGReeJM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzQ1LzA1Lzky/LzM2MF9GXzM0NTA1/OTIzMl9DUGllVDhS/SVdPVWs0SnFCa2tX/a0lFVFlBa216MmI3/NS5qcGc"
                    width={300}
                    height={300}
                    
                    
                    className="bg-gray-100 dark:bg-transparent p-5 h-[300px] w-[300px] object-contain rounded-xl"
                  />
                  <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                  <p className="text-xl font-semibold text-red-500">${product.price}</p>


                  <div className="flex items-center mt-2">
                    {product.reviews?.length > 0 ? (
                      <>
                        <p className="text-yellow-500 text-2xl">{getRatingStars(product.reviews)}</p>
                        <p className="ml-2 text-gray-700 dark:text-gray-300 text-lg">({product.reviews?.length || 0})</p>


                      </>
                    ) : (
                      <p className="text-gray-500 text-2xl">{"☆".repeat(5)}</p> 
                    )}
                  </div>

                </div>
              </a>
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
