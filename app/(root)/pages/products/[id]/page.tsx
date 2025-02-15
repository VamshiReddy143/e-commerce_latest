"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>(""); // ✅ State for main image

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`, {
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        setProduct(data);
        setMainImage(data.images[0]); // ✅ Set the first image as the default main image
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <p className="text-black text-center mt-10">Loading...</p>;

  if (!product)
    return (
      <div className="text-black flex flex-col items-center mt-10">
        <h1 className="text-3xl font-bold mt-4">Product not found</h1>
      </div>
    );

  return (
    <div className="text-black flex  gap-[10em] justify-center mt-10">
 <div>
       {/* ✅ Large Main Image */}
       <Image
        className="bg-gray-100 p-5 h-[400px] w-[400px] object-contain rounded-xl transition-all"
        src={mainImage}
        width={400}
        height={400}
        alt={product.name}
      />

      {/* ✅ Small Thumbnails */}
      <div className="flex gap-4 mt-4">
        {product.images.map((image, index) => (
          <Image
            key={index}
            className={`h-[100px] w-[100px] object-contain cursor-pointer  rounded-lg transition ${
              mainImage === image ? "border-4 border-red-500" : "border border-gray-300"
            }`}
            src={image}
            width={100}
            height={100}
            alt={`Thumbnail ${index}`}
            onClick={() => setMainImage(image)} // ✅ Clicking updates the main image
          />
        ))}
      </div>
 </div>

<div>
<h1 className="text-3xl font-bold mt-4">{product.name}</h1>
      <p className="text-lg mt-2">{product.description}</p>
      {
        product.sizes && product.sizes?.length > 0 && (
          <div className="flex gap-2 mt-2">
            {product.sizes.map((size, index) => (
              <p key={index} className="text-lg bg-gray-100 p-2 h-10 w-10 items-center cursor-pointer font-bold mt-2">
                {size}
              </p>
            ))}
          </div>
        )
      }
      <div className="flex items-center mt-10 gap-10">
      <button className="bg-red-500 p-3 mt-4 rounded-full text-white">Add to Cart</button>
      <p className="text-2xl font-bold mt-2">$ {product.price}</p>
      </div>
</div>
    </div>
  );
};

export default ProductDetails;
