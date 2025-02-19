"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";

import Loader from "@/components/Loader";
import { useProducts } from "@/app/hooks/useProducts";




const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("asc");
  const { products, loading, error } = useProducts(currentPage, sortBy);

  const pageLimit = 12;

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      return sortBy === "asc" ? a.price - b.price : b.price - a.price;
    });
  }, [sortBy, products]);

  const getRatingStars = (reviews: { rating: number }[]) => {
    if (!reviews?.length) return "☆☆☆☆☆";

    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    return "⭐".repeat(Math.floor(avgRating)) + (avgRating % 1 >= 0.5 ? "⭐" : "") + "☆".repeat(5 - Math.floor(avgRating) - (avgRating % 1 >= 0.5 ? 1 : 0));
  };


  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(products.length / pageLimit)) {
      setCurrentPage(newPage);
    }
  };


  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
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
    <div className="mx-auto mb-[6em] p-6">
      {/* Sorting Options */}
      <div className="flex justify-between mb-6">
        <select
          className="border rounded-md p-2 dark:bg-gray-700 dark:text-white"
          onChange={handleSortChange}
          value={sortBy}
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Product List */}
      <div className="text-black dark:text-white flex flex-wrap gap-10">
        {sortedProducts
          .slice((currentPage - 1) * pageLimit, currentPage * pageLimit)
          .map((product) => (
            <Link key={product._id} href={`/pages/products/${product._id}`} passHref>
              <div className="cursor-pointer bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-2xl transition">
                <Image
                  className="bg-gray-100 dark:bg-transparent p-5 h-[300px] w-[300px] object-contain rounded-xl"
                  src={product.images[0]}
                  width={400}
                  height={400}
                  loading="lazy"
                  alt={product.name}
                />
                <h1 className="text-xl mt-2">{product.name}</h1>
                <p className="text-2xl font-bold mt-1">${product.price}</p>






                <div className="flex items-center mt-2">
                  {product.reviews?.length > 0 ? (
                    <>
                      {/* Compute average rating */}
                      {(() => {
                        // const avgRating =
                        //   product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

                        // const fullStars = Math.floor(avgRating); // Number of full stars
                        // const halfStar = avgRating % 1 >= 0.5 ? 1 : 0; // Half star condition
                        // const emptyStars = 5 - fullStars - halfStar; // Remaining empty stars

                        return (
                          <div className="flex items-center mt-2">
                            <p className="text-yellow-500 text-2xl">{getRatingStars(product.reviews)}</p>
                            <p className="ml-2 text-gray-700 dark:text-gray-300 text-lg">
                              ({product.reviews.length} {product.reviews.length > 1 ? "reviews" : "review"})
                            </p>
                          </div>

                        );
                      })()}

                    </>
                  ) : (
                    <p className="text-gray-500 text-2xl">{"☆".repeat(5)}</p> // Empty stars when no reviews
                  )}
                </div>




              </div>
            </Link>
          ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 border rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="px-4 py-2 mx-2">{`Page ${currentPage}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 mx-2 border rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page;
