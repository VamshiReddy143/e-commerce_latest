"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { getRandomColor } from "@/utils/randomColor";

interface Review {
  user: { name: string; image?: string };
  rating: number;
  comment: string;
  createdAt:Date | string;
}



const ReviewList = ({ reviews }: { reviews: Review[] }) => {
  const getInitials = (name: string) => name.charAt(0).toUpperCase();

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
              className="border border-gray-300 dark:border-gray-600 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800"
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
                    style={{ backgroundColor: getRandomColor(review.user.name) }}
                  >
                    {getInitials(review.user.name)}
                  </div>
                )}

                <div>
                  <p className="font-bold text-lg">{review.user.name}</p>
                  <p className="text-sm dark:text-gray-400 text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
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
