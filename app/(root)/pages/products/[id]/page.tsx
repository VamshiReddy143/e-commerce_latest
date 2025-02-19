"use client";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import Loader from "@/components/Loader";
import {debounce} from "lodash";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes?: string[];
  colors?: string[];
  category: string;
  reviews: {
    user: {
      name: string;
      image?: string;
    };
    rating: number;
    comment: string;
    createdAt: Date ;
  }[];
 
}




const useReviews = (productId: string) => {
  const [reviews, setReviews] = useState<Product["reviews"]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => { 
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      
      const data = await res.json();
      
      const formattedData = data.map((review: Product["reviews"][0]) => ({
        ...review,
        createdAt: new Date(review.createdAt).toISOString(), 
      }));
  
      setReviews(formattedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [productId]); 

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]); 

  return { reviews, loading, fetchReviews };
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
  const { reviews, loading: reviewsLoading, fetchReviews } = useReviews(id as string);

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

  const handleAddToCart = useMemo(() => 
    debounce(async () => {
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
    }, 500), [selectedSize, session, product?._id])
  
  


  const avgRating = useMemo(() => {
    if (!product?.reviews?.length) return "☆☆☆☆☆";
    const rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    return "⭐".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "⭐" : "") + "☆".repeat(5 - Math.floor(rating) - (rating % 1 >= 0.5 ? 1 : 0));
  }, [product?.reviews]);
  



  if (productLoading || reviewsLoading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader />
    </div>
  )
  if (error || !product)
    return (
      <div className="text-black flex flex-col items-center mt-10">
        <h1 className="text-3xl font-bold mt-4">

        </h1>
      </div>
    );


  return (
    <>
      <div className="text-black dark:text-white sm:flex gap-[10em] p-5   sm:p-0 justify-center sm:mt-10">
        <div>
          <Image
            className="bg-gray-100 p-5 h-[400px] w-[400px] object-contain rounded-xl transition-all"
            src={mainImage || "https://imgs.search.brave.com/Dwe3RRvsmgqv_lNOqfaBWV6Xg4H0PePpXZeQEGReeJM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzQ1LzA1Lzky/LzM2MF9GXzM0NTA1/OTIzMl9DUGllVDhS/SVdPVWs0SnFCa2tX/a0lFVFlBa216MmI3/NS5qcGc"}
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

        <div className="sm:w-[40%] w-full">
          <h1 className="text-6xl font-bold font-sans mt-4">{product.name}</h1>

          <div className="sm:flex sm:items-center mt-2">
            {product.reviews?.length > 0 ? (
              <>
               
                    <p className="text-yellow-500 text-2xl">{avgRating}</p>

                
                <p className="ml-2 text-gray-700 dark:text-gray-300 text-lg">
                  ({product.reviews?.length} {product.reviews?.length > 1 ? "reviews" : "review"})
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-2xl">{"☆".repeat(5)}</p>
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
                  className={`text-lg bg-gray-100 dark:text-black p-2 h-fit w-fit rounded-sm flex justify-center items-center cursor-pointer font-bold mt-2 transition ${selectedSize === size ? "bg-red-500 text-white" : "hover:bg-gray-300"
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
      <div className=" sm:flex gap-4 mx-auto mt-10 mb-10 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
        {<ReviewForm productId={id as string} onReviewAdded={fetchReviews} />}
        <ReviewList  reviews={reviews} />
      </div>
      <Toaster />
    </>
  );
};

export default ProductDetails
