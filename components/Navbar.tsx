"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { FaCartShopping } from "react-icons/fa6";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "@/app/hooks/useDebounce";
import Theme from "./Theme";
import { FaStore, FaEnvelope } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { MdHome } from "react-icons/md";
// import { useSession } from "next-auth/react";

interface User {
  name?: string;
  isAdmin?: boolean;
}

const Navbar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  // const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [user, setUser] = useState<User | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
  }, [open]);

  const mobLinks = [
    { name: "Home", path: "/", icon: <MdHome size={20} /> },
    { name: "Shop", path: "/pages/shop", icon: <FaStore size={20} /> },
    { name: "About Us", path: "/contactUs", icon: <FaInfoCircle size={20} /> },
    { name: "Contact Us", path: "/contact", icon: <FaEnvelope size={20} /> },
    { name: "Orders", path: "/orders", icon: <FaEnvelope size={20} /> },
    {name:"Cart",path:"/cart",icon:<FaCartShopping size={20}/>},
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/session",{cache:"no-store"});
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user);
      } catch  {
        console.error("User not logged in");
        setUser(null);
      }finally{
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
    setUser(null);
    router.replace("/login"); 
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/pages/shop" },
    { name: "About Us", path: "/contactUs" },
    { name: "Contact Us", path: "/contact" },
    { name: "Orders", path: "/orders" }
  ];

  useEffect(() => {
    if (pathname === "/pages/shop") {
      const currentQuery = searchParams.get("q") || "";
      if (debouncedSearch !== currentQuery) {
        const newUrl = debouncedSearch 
          ? `/pages/shop?q=${encodeURIComponent(debouncedSearch)}`
          : "/pages/shop";
        router.push(newUrl);
      }
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleSearchClick = () => {
    if (pathname !== "/pages/shop") {
      router.push("/pages/shop");
    }
    setOpen((prev) => !prev);
  };

  if (loading) return null; 
  return (
    <>
      <div className="flex dark:text-white dark:bg-gray-900 justify-between items-center rounded-xl p-4 sm:p-5">
        <div className="flex gap-6 sm:gap-10 items-center">
          <Link href={"/"}>
            <h1 className="text-xl sm:text-5xl font-serif text-red-400">PHOLEX</h1>
          </Link>
          <ul className="hidden sm:flex gap-6 sm:gap-10">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.path}
                  className={`${pathname === link.path ? "text-red-500 font-bold" : ""
                    } hover:text-red-400 transition`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden sm:block relative w-full sm:w-[500px]">
          {pathname === "/pages/shop" && (
            <div className="flex">
              <input
              type="search"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search products..."
              className="p-3 pr-10 border border-gray-300 rounded-full w-full sm:w-[500px]"
            />
           <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
           <Search
            size={20}
            onClick={handleSearchClick}
            className="cursor-pointer"
          />
           </div>
            </div>
            
          )}
         
        </div>

        <div className="flex gap-4 sm:gap-6 items-center cursor-pointer">
          <Link href={"/Analytics"}>
            {user && user?.isAdmin && (
              <p className="bg-red-500 p-3 text-white cursor-pointer px-3 flex items-center rounded-full">
                Dashboard
              </p>
            )}
          </Link>
          <div>
            <Theme />
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <Link href={"/profile"}>
                <div className="h-8 w-8 bg-red-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button onClick={handleLogout} className=" sm:block text-red-500 hover:text-red-700">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className=" sm:block hover:text-red-400">
              Login
            </Link>
          )}

        
         

          <Link href={"/cart"} className="hidden sm:block relative">
            <FaCartShopping size={20} />
            
          </Link>
        </div>

        <div className="sm:hidden z-[999] fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 dark:text-white p-4 flex justify-around items-center border-t border-gray-300">
          {mobLinks.map((link, index) => (
            <Link key={index} href={link.path}>
              <div className="flex flex-col items-center">
                {link.icon}
                <span className="text-xs">{link.name}</span>
              </div>
            </Link>
          ))}
         
        
            {/* <Link href="/cart" className="relative">
            <div className="flex flex-col items-center">
            <FaCartShopping size={20} />
            <p>cart</p>
            </div>
          </Link> */}
        
         
        </div>
      </div>
      <div className="p-3 sm:hidden relative w-full sm:w-[500px]">
          {pathname === "/pages/shop" && (
            <div className="flex">
              <input
              type="search"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search products..."
              className="p-3 pr-10 border border-gray-300 rounded-full w-full sm:w-[500px]"
            />
           <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
           <Search
            size={20}
            onClick={handleSearchClick}
            className="cursor-pointer"
          />
           </div>
            </div>
            
          )}
         
        </div>
    </>
  );
};

export default Navbar;