"use client";

import Image from "next/image";
import React, { useCallback, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Upload, Trash2 } from "lucide-react";
import AdminProducts from "./ui/AdminProducts";

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
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sm:flex gap-10  p-6 rounded-lg w-full  mx-auto"
    >
      <div>
        <h2 className="text-3xl font-bold  mb-4">Add Product</h2>

        {/* Product Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border border-gray-600 rounded-md  p-3 mb-3 w-full focus:ring-2 focus:ring-red-400"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="border border-gray-600 h-[8em]  rounded-md p-3 mb-3 w-full focus:ring-2 focus:ring-red-400"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="border border-gray-600  rounded-md p-3 mb-3 w-full focus:ring-2 focus:ring-red-400"
        />

        {/* Category Selection */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="border border-gray-600 rounded-md p-3 mb-3 w-full  focus:ring-2 focus:ring-red-400"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        {/* Sizes */}
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
          className="border border-gray-600 rounded-md  p-3 mb-3 w-full focus:ring-2 focus:ring-red-400"
        />

        {/* Image Upload */}
        <label className="flex items-center gap-3  cursor-pointer">
          <Upload size={20} />
          <span>Upload Images</span>
          <input type="file" className="hidden" multiple onChange={handleImageUpload} />
        </label>

        {/* Image Preview */}
        {formData.images.length > 0 && (
          <motion.div
            className="flex mt-4 flex-wrap gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {formData.images.map((url, index) => (
              <div key={index} className="relative w-20 h-20">
                <Image
                  src={url}
                  alt={`Product ${index}`}
                  width={100}
                  height={100}
                  className="w-full h-full rounded-md object-cover border"
                />
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() => handleImageRemove(index)}
                  type="button"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-red-500 p-3 mt-4 rounded-full text-white w-full hover:bg-red-600 transition-all"
          type="submit"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </motion.button>
      </div>

      <div>
        <AdminProducts />
      </div>

      <Toaster />
    </motion.form>
  );
};

export default AddProductForm;
