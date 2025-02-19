"use client";
import { useUserId } from "@/app/hooks/useUserId";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ReviewForm = ({ productId, onReviewAdded }: { productId: string; onReviewAdded: () => void }) => {
  const [rating, setRating] = useState<number>(0); // Start with no selection
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = useUserId();

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, rating, comment }),
      });
      const data = await response.json(); 
      if (!response.ok) throw new Error(data.message || "Failed to submit review");

      toast.success(data.message || "Review submitted successfully!");
      setComment("");
      setRating(0); 
      onReviewAdded();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmitReview}
      className="mt-6 w-full max-w-lg border dark:border-gray-700 p-6 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-900"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-4">Leave a Review</h3>

      {/* Star Rating Selection */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
      <div className="flex space-x-2 my-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.span
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(null)}
            className={`cursor-pointer text-3xl transition ${
              (hoveredRating ?? rating) >= star ? "text-yellow-500" : "text-gray-400"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ★
          </motion.span>
        ))}
      </div>

      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">Comment</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        className="mt-1 block w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
        placeholder="Write your review..."
      ></textarea>

      <motion.button
        type="submit"
        className="mt-4 bg-red-700 text-white px-6 py-3 rounded-xl w-full font-semibold transition hover:bg-red-600 "
        disabled={loading || rating === 0}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </motion.button>
    </motion.form>
  );
};

export default ReviewForm;
