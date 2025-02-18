"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getRandomColor } from "@/utils/randomColor";

interface Review {
  user: { name: string; image?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

const ReviewList = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/products/${productId}/reviews`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) return <p className="text-gray-500 text-center">Loading reviews...</p>;

  return (
    <motion.div
      className="mt-6 w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {reviews.length > 0 ? (
        <ul className="space-y-6">
          {reviews.map((review, index) => (
            <motion.li
              key={index}
              className="border  border-gray-300 dark:border-gray-600 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-4">
                {review.user.image ? (
                  <Image
                    src={review.user.image}
                    width={50}
                    height={50}
                    alt={review.user.name}
                    className="rounded-full border border-gray-300"
                  />
                ) : (
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-lg"
                    style={{ backgroundColor: getRandomColor(review.user.name) }} // Unique color
                  >
                    {getInitials(review.user.name)}
                  </div>
                )}

                <div>
                  <p className="font-bold text-lg">{review.user.name}</p>
                  <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-yellow-500 text-xl mt-2">
                {"⭐".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{review.comment}</p>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-lg text-center">No reviews yet. Be the first to review!</p>
      )}
    </motion.div>
  );
};

export default ReviewList;
