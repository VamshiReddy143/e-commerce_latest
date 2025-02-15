"use client";

import Image from "next/image";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const categories = [
  "watches",
  "headphones",
  "laptops",
  "gaming",
  "futuristic",
  "soundbar",
];

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    sizes: [],
    images: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
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
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if(response.ok){
        await response.json();
        setFormData({
          name: "",
          description: "",
          price: 0,
          category: "",
          sizes: [],
          images: [],
        });
        toast.success("Product added successfully");
    }else{
        toast.error("Failed to add product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        onChange={handleChange}
        className="border border-gray-300 rounded-md p-2 mb-4 w-[50%]"
      />
      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
         className="border border-gray-300 h-[10em] rounded-md p-2 mb-4 w-[50%]"
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        onChange={handleChange}
         className="border border-gray-300 rounded-md p-2 mb-4 w-[50%]"
      />
      <select  className="border border-gray-300 rounded-md p-2 mb-4 w-[50%] text-black" name="category" onChange={handleChange}>
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
         className="border border-gray-300 rounded-md p-2 mb-4 w-[50%]"
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            sizes: e.target.value.split(","),
          }))
        }
      />
      <input type="file" className="text-black" multiple onChange={handleImageUpload} />
      {
        formData.images.length > 0 && (
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
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )
      }
      <button className="bg-red-500 p-3 mt-4 rounded-full w-[50%]" type="submit">Add Product</button>

      <Toaster/>
    </form>
  );
};

export default AddProductForm;