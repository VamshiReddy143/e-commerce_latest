"use client";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes?: string[];

}




const useReviews = (productId: string) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return { reviews, loading };
};

const useProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);






  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`, {
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

const ProductDetails = () => {
  const { id } = useParams();
  const { product, loading: productLoading, error } = useProduct(id as string);
  const { reviews, loading: reviewsLoading } = useReviews(id as string);
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const { data: session } = useSession();





  const handleImageChange = useCallback((image: string) => {
    setMainImage(image);
  }, []);

  useEffect(() => {
    if (product?.images?.length) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  const handleSizeSelection = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {

    if (!session) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setAddingToCart(true);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product?._id,
          size: selectedSize,
          quantity: 1,
        }),
      });

      if (!response.ok) throw new Error("Failed to add product to cart");

      toast.success("Added to cart successfully!");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setAddingToCart(false);
    }
  };


  if (error || !product)
    return (
      <div className="text-black flex flex-col items-center mt-10">
        <h1 className="text-3xl font-bold mt-4">Product not found</h1>
      </div>
    );

  if (productLoading || reviewsLoading) return <p>Loading...</p>;


  return (
    <>
      <div className="text-black flex gap-[10em] justify-center mt-10">
        <div>
          <Image
            className="bg-gray-100 p-5 h-[400px] w-[400px] object-contain rounded-xl transition-all"
            src={mainImage}
            width={400}
            height={400}
            alt={product.name}
            priority
          />

          <div className="flex gap-4 mt-4">
            {product.images.map((image, index) => (
              <Image
                key={index}
                className={`h-[100px] w-[100px] object-contain cursor-pointer rounded-lg transition ${mainImage === image ? "border-4 border-red-500" : "border border-gray-300"
                  }`}
                src={image}
                width={100}
                height={100}
                alt={`Thumbnail ${index}`}
                loading="lazy"
                onClick={() => handleImageChange(image)}
              />
            ))}
          </div>
        </div>

        <div className="w-[40%]">
          <h1 className="text-6xl font-bold font-sans mt-4">{product.name}</h1>

          <div className="flex items-center mt-2">
            {product.reviews?.length > 0 ? (
              <>
                {/* Compute average rating */}
                {(() => {
                  const avgRating =
                    product.reviews?.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

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
                  ({product.reviews?.length} reviews)
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-2xl">{"☆".repeat(5)}</p> // Empty stars when no reviews
            )}
          </div>


          <p className="text-lg mt-10 mb-10">{product.description}</p>

          {/* Sizes Section */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex gap-2 mt-2">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => handleSizeSelection(size)}
                  className={`text-lg bg-gray-100 p-2 h-10 w-10 flex justify-center items-center cursor-pointer font-bold mt-2 transition ${selectedSize === size ? "bg-red-500 text-white" : "hover:bg-gray-300"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}


          <div className="flex items-center mt-10 gap-10">
            <button
              className="bg-red-500 p-3 mt-4 rounded-full text-white disabled:opacity-50"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <p className="text-2xl font-bold mt-2">$ {product.price}</p>
          </div>
        </div>



      </div>
      <div className=" flex gap-4 mx-auto mt-10 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        {session && <ReviewForm productId={id as string} onReviewAdded={() => window.location.reload()} />}
        <ReviewList productId={id as string} />
      </div>
      <Toaster />
    </>
  );
};

export default ProductDetails;
