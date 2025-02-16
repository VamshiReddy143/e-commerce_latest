"use client";

import Image from "next/image";
import React, { useCallback, useState } from "react";
import toast, { Toaster } from "react-hot-toast";


interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  images: string[];
}

const categories = [
  "watches",
  "headphones",
  "laptops",
  "gaming",
  "futuristic",
  "soundbar",
];

const AddProductForm = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    sizes: [],
    images: [],
  });

  const [loading, setLoading] = useState(false);


  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + formData.images.length > 5) {
        toast.error("You can upload a maximum of 5 images.");
        return;
      }


      const urls = await Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    }
  };


  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add product");

      toast.success("Product added successfully");

      // Reset form after submission
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        sizes: [],
        images: [],
      });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="border border-gray-300 rounded-md text-black p-2 mb-4 w-[50%]"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="border border-gray-300 h-[10em] text-black rounded-md p-2 mb-4 w-[50%]"
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
        className="border border-gray-300 text-black rounded-md p-2 mb-4 w-[50%]"
      />
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        className="border border-gray-300 rounded-md p-2 mb-4 w-[50%] text-black"
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="sizes"
        placeholder="Sizes (comma-separated)"
        value={formData.sizes.join(",")}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            sizes: e.target.value.split(",").map((size) => size.trim()),
          }))
        }
        className="border border-gray-300 rounded-md text-black p-2 mb-4 w-[50%]"
      />
      <input type="file" className="text-black" multiple onChange={handleImageUpload} />

      {/* Image Preview */}
      {formData.images.length > 0 && (
        <div className="flex mt-10 flex-wrap w-[50%]">
          {formData.images.map((url, index) => (
            <div key={index} className="relative w-24 h-24 mr-2 mb-2">
              <Image
                src={url}
                alt={`Product ${index}`}
                width={100}
                height={100}
                className="w-full h-full rounded-md cursor-pointer"
              />
              <button
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                onClick={() => handleImageRemove(index)}
                type="button"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <button
        className="bg-red-500 p-3 mt-4 rounded-full w-[50%]"
        type="submit"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Product"}
      </button>

      <Toaster />
    </form>
  );
};

export default AddProductForm;
