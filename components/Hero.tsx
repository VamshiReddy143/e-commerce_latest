"use client"; // ✅ Required for client components in Next.js 15
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import shoe1 from "@/public/shoe1.png";
import type { StaticImageData } from "next/image";
import Link from "next/link";

// Product data with images
const products: { heading: string; name: string, image: string | StaticImageData; title: string }[] = [
  {
    image:
      "https://prod4-sprcdn-assets.sprinklr.com/200052/5b5b94f9-3bab-4e6b-ac8f-2183c4218a27-361538681/370.png",
    title: "Beats Solo ",
    name: "HEADPHONE",
    heading: "Wireless",
  },
  {
    image: shoe1,
    title: "Best collection",
    name: "SHOES",
    heading: "Branded"
  },
  {
    image:
      "https://png.pngtree.com/png-vector/20240822/ourmid/pngtree-stylish-red-hoodie-for-men-perfect-casual-wear-png-image_13581331.png",
    title: "Hoodie",
    name: "HOODIE",
    heading: "Premium look"
  },
];

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Function to go to the next image
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  // Function to go to the previous image
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="bg-gray-200  sm:p-10 mt-10 rounded-[30px] relative">
      {/* Content Section */}
      <div className="flex flex-col mb-4 sm:mb-10 ml-4 sm:ml-10 p-4 sm:p-10">
        <h3 className="text-black font-bold text-lg sm:text-3xl ">
          {products[currentIndex].title}
        </h3>
        <h2 className="text-black font-extrabold text-4xl sm:text-9xl">
          {products[currentIndex].heading}
        </h2>
        <h1 className="text-[50px] sm:text-[170px] font-extrabold text-white">
          {products[currentIndex].name}
        </h1>
        <div className="flex justify-start ">
        <Link href={"/pages/shop"}>
          <button  className="text-white bg-red-500 p-2 sm:p-3 rounded-full">
            Shop by Category
          </button>
          </Link>
        </div>
      </div>

      {/* Sliding Product Image */}
      <div className="absolute top-[17px] right-[14px] sm:right-[50px] transition-opacity duration-700 ease-in-out opacity-100">
        <Image
          key={currentIndex}
          src={products[currentIndex].image}
          alt={products[currentIndex].title}
          width={200}
          height={200}
          className="h-[10em] w-[10em] sm:h-[40em] sm:w-[40em]"
        />
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-[10px] top-[50%] transform -translate-y-1/2 bg-gray-800 text-white p-2 sm:p-4 rounded-full hover:bg-gray-600 transition"
      >
        <FaChevronLeft size={16} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-[10px] top-[50%] transform -translate-y-1/2 bg-gray-800 text-white p-2 sm:p-4 rounded-full hover:bg-gray-600 transition"
      >
        <FaChevronRight size={16} />
      </button>
    </div>
  );
};

export default Hero;