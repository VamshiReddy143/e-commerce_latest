"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { FaCartShopping } from "react-icons/fa6";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "@/app/hooks/useDebounce";
import Loader from "./Loader";

const Navbar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [user, setUser] = useState(null); // Store user data

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
  }, [open]);

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/session"); // Adjust based on your authentication setup
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user); // Store user data
      } catch (error) {
        console.error("User not logged in");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout"); 
    setUser(null);
    router.push("/login");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/pages/shop" },
    { name: "About Us", path: "/contactUs" },
    { name: "Contact Us", path: "/contact" },

  ];

  useEffect(() => {
    if (pathname === "/pages/shop") {
      router.push(debouncedSearch ? `/pages/shop?q=${debouncedSearch}` : "/pages/shop");
    }
  }, [debouncedSearch]);

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
                className={`${pathname === link.path ? "text-red-500 font-bold" : "text-gray-700"
                  } hover:text-red-400 transition`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Search Bar (Visible on Shop Page) */}
      <div>
        {open && pathname === "/pages/shop" && (
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search products..."
            className="p-3 border border-gray-300 rounded-full w-full sm:w-[500px]"
          />
        )}
      </div>

     



      {/* Right Section: Profile/Login, Search, and Cart */}
      <div className="flex gap-4 sm:gap-6 items-center cursor-pointer">
     <Link href={"/Analytics"}>
     {user && user?.isAdmin && (
          <p className="bg-red-500 p-3 text-white cursor-pointer px-3 flex items-center rounded-full">Dashboard</p>
        )}
     </Link>
        {user ? (
          <div className="flex items-center gap-3">
            {/* User's First Letter Profile Icon */}
           <Link href={"/profile"}>
           <div className="h-8 w-8 bg-red-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
           </Link>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="hidden sm:block hover:text-red-400">
            Login
          </Link>
        )}

        <Link href={'/pages/shop'}>
          <Search size={20} onClick={() => setOpen(!open)} className="cursor-pointer" />
        </Link>

        <Link href={"/cart"} className="relative">
          <FaCartShopping size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
