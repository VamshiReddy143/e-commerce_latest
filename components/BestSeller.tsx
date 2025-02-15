import Image from "next/image";
import React from "react";
import headset from "@/public/earphone.png";

const BestSellee = () => {
  return (
    <div className="mt-[80px] text-black flex flex-col justify-center">
      {/* Title */}
      <div className="flex justify-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold">Best Seller Products</h1>
      </div>

      {/* Product Grid */}
      <div className="mt-10 gap-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {/* Product Card */}
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Image */}
              <Image
                src={headset}
                alt="Earphone"
                width={300}
                height={300}
                className="h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] bg-gray-200 p-6 sm:p-9 rounded-[30px] cursor-pointer"
              />
              {/* Details */}
              <div className="mt-4 text-center">
                <h2 className="text-black font-bold text-lg sm:text-xl cursor-pointer">Beats</h2>
                <h1 className="text-black font-bold text-2xl sm:text-3xl">$995</h1>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BestSellee;