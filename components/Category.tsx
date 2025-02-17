import Image from "next/image";
import React from "react";
import Link from "next/link";
import earphone from "@/public/earphone.png";
import watch from "@/public/watch.png";
import laptop from "@/public/laptop.png";
import station from "@/public/playstation.png";
import vr from "@/public/vr.png";
import bt from "@/public/bluetooth.png";

const Category = () => {
  return (
    <div className="mt-8 sm:p-0 p-4">
      {/* First Row */}
      <div className="grid grid-cols-1 sm:flex gap-6">
        <Link href="/categories/headphones">
          <div className="first bg-black cursor-pointer w-full sm:w-fit p-5 rounded-[30px] flex flex-col sm:flex-row items-center">
            <div className="text-center sm:text-left">
              <p className="font-bold text-white">Enjoy</p>
              <h2 className="text-xl sm:text-2xl font-bold text-white">With</h2>
              <h1 className="text-gray-400 font-extrabold font-mono text-4xl sm:text-5xl">EARPHONE</h1>
              <button className="bg-red-500 p-3 mt-4 rounded-full">Explore</button>
            </div>
            <div className="mt-4 sm:mt-0">
              <Image src={earphone} alt="Earphone" width={200} height={200} className="h-[150px] w-[150px] sm:h-[200px] sm:w-[200px]" />
            </div>
          </div>
        </Link>

        <Link href="/categories/watches">
          <div className="first bg-yellow-400 cursor-pointer w-full sm:w-fit p-5 rounded-[30px] flex flex-col sm:flex-row items-center">
            <div className="text-center sm:text-left">
              <p className="font-bold text-gray-500">New</p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-400">Wear</h2>
              <h1 className="text-gray-700 font-extrabold font-sans text-5xl sm:text-6xl">Gadget</h1>
              <button className="bg-white text-yellow-900 p-3 mt-4 rounded-full">Explore</button>
            </div>
            <div className="mt-4 sm:mt-0">
              <Image src={watch} alt="Watch" width={200} height={200} className="h-[150px] w-[150px] sm:h-[200px] sm:w-[200px]" />
            </div>
          </div>
        </Link>

        <Link href="/categories/laptops">
          <div className="first bg-red-500 cursor-pointer w-full sm:w-[120%] p-5 rounded-[30px] flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left">
              <p className="font-bold text-gray-200">Trend</p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-300">Devices</h2>
              <h1 className="text-white font-extrabold font-mono text-4xl sm:text-7xl">LAPTOP</h1>
              <button className="bg-white text-red-900 p-3 mt-4 rounded-full">Explore</button>
            </div>
            <div className="mt-4 sm:mt-0">
              <Image src={laptop} alt="Laptop" width={200} height={200} className="h-[150px] w-[150px] sm:h-[200px] sm:w-[200px]" />
            </div>
          </div>
        </Link>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 sm:flex gap-6 mt-8">
        <Link href="/categories/gaming">
          <div className="first bg-gray-200 cursor-pointer w-full sm:w-[100%] p-5 rounded-[30px] flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left">
              <p className="font-bold text-black">Best</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-black">Gaming</h2>
              <h1 className="text-gray-800 font-extrabold font-mono text-5xl sm:text-8xl">CONSOLE</h1>
              <button className="bg-red-500 text-white p-3 mt-4 rounded-full">Explore</button>
            </div>
            <div className="mt-4 sm:mt-0">
              <Image src={station} alt="Console" width={200} height={200} className="h-[150px] w-[150px] sm:h-[300px] sm:w-[200px] object-cover" />
            </div>
          </div>
        </Link>

        <Link href="/categories/futuristic">
          <div className="first bg-green-400 cursor-pointer w-full sm:w-fit p-5 rounded-[30px] flex flex-col sm:flex-row items-center">
            <div className="text-center sm:text-left">
              <p className="font-bold text-gray-500">Play</p>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Game</h2>
              <h1 className="text-green-200 font-extrabold font-sans text-5xl sm:text-6xl">OCULUS</h1>
              <button className="bg-white text-green-900 p-3 mt-4 rounded-full">Explore</button>
            </div>
            <div className="mt-4 sm:mt-0">
              <Image src={vr} alt="Oculus" width={200} height={200} className="h-[150px] w-[150px] sm:h-[300px] sm:w-[200px] object-cover" />
            </div>
          </div>
        </Link>

        <Link href="/categories/soundbar">
          <div className="first bg-blue-500 cursor-pointer w-full sm:w-fit p-5 rounded-[30px] flex flex-col sm:flex-row items-center">
            <div className="text-center sm:text-left">
              <p className="font-bold text-gray-100">New</p>
              <h2 className="text-xl sm:text-3xl font-bold text-gray-100">Amazon</h2>
              <h1 className="text-blue-200 font-extrabold font-sans text-5xl sm:text-6xl">Gadget</h1>
              <button className="bg-white text-blue-500 p-3 mt-4 rounded-full">Explore</button>
            </div>
            <div className="mt-4 sm:mt-0">
              <Image src={bt} alt="Bluetooth" width={200} height={200} className="h-[150px] w-[150px] sm:h-[300px] sm:w-[300px] object-contain" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Category;
