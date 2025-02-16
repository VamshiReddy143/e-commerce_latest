"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { FaCartShopping } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);


  // const fetchCartCount = async () => {
  //   try {
  //     const res = await fetch("/api/cart", { cache: "no-store" });
  //     if (!res.ok) throw new Error("Failed to fetch cart");
  //     const data = await res.json();
      

  //     const totalItems = data.reduce((acc: number, item: any) => acc + item.quantity, 0);
  //     setCartCount(totalItems);
  //   } catch (error) {
  //     console.error("Error fetching cart count:", error);
  //   }
  // };


  // useEffect(() => {
  //   fetchCartCount();

  //   const handleCartUpdate = () => fetchCartCount();
  //   window.addEventListener("cartUpdated", handleCartUpdate);
  
  //   return () => {
  //     window.removeEventListener("cartUpdated", handleCartUpdate);
  //   };

  // }, []);

 
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/pages/shop" },
    { name: "About Us", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact Us", path: "/contact" },
    { name: "Create", path: "/pages/createpage" }
  ];

  return (
    <div className="flex justify-between items-center bg-white text-black rounded-xl p-4 sm:p-5">
      {/* Left Section: Logo and Navigation Links */}
      <div className="flex gap-6 sm:gap-10 items-center">
        <h1 className="text-2xl sm:text-3xl font-serif text-red-400">PHOLEX</h1>
        <ul className="hidden sm:flex gap-6 sm:gap-10">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.path}
                className={`${
                  pathname === link.path ? "text-red-500 font-bold" : "text-gray-700"
                } hover:text-red-400 transition`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 sm:gap-6 items-center cursor-pointer">
        <p className="hidden sm:block">Login</p>
        <Search size={20} />

      
        <Link href={"/cart"} className="relative">
          <FaCartShopping size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile Navigation (Hamburger Menu) */}
      <div className="sm:hidden flex items-center">
        <button className="text-gray-700 hover:text-red-400 transition">
          ☰
        </button>
      </div>
    </div>
  );
};

export default Navbar;
