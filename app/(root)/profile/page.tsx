"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/Loader";
import { useUserId } from "@/app/hooks/useUserId";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const userId = useUserId();
    const [name, setName] = useState<string>("");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
 

    const defaultAvatar = useMemo(() => (
        <div className="h-[100px] w-[100px] bg-red-500 text-white flex items-center justify-center rounded-full text-[50px] font-bold">
            {name?.charAt(0).toUpperCase()}
        </div>
    ), [name]);

    const fetchUserData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/profile?userId=${userId}`);
            if (!response.ok) throw new Error("Failed to fetch user data");
            const data = await response.json();
    
            setName(data.user.name);
            setProfileImage((prevImage) => prevImage !== data.user.image ? data.user.image : prevImage);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);
    

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (status === "authenticated" && userId) {
            fetchUserData();
        }
      
    }, [status, session, fetchUserData, router, userId]);



    if (status === "loading" || loading) {
        return (
            <motion.div className="flex flex-col items-center justify-center h-screen">
                <Loader />
                <p className="mt-4 text-gray-600">Loading profile...</p>
            </motion.div>
        );
    }
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            toast.error("User ID is missing. Please log in again.");
            return;
        }
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("name", name);
        if (profileImage ) {
            formData.append("profileImage", profileImage);
        }
        try {
            const response = await fetch("/api/profile", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Profile updated successfully!");
                setProfileImage(data.user.image);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        }
    };

   
    

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }} 
            className="flex flex-col items-center mt-10 sm:pl-[10em] max-md:w-[100vw] h-screen w-full "
        >
            <h1 className="text-4xl text-gray-700 sm:text-5xl font-bold mb-6 text-center min-h-[56px]">
    {name ? (
        <>Hello <strong className="text-red-600">{name} 👋</strong></>
    ) : (
        <span className="inline-block bg-gray-300 w-32 h-8 animate-pulse rounded-md"></span>
    )}
</h1>


            {/* Profile Image Upload */}
            <div className="relative mb-4 w-[100px] h-[100px]">
                {profileImage ? (
                    <Image
                        src={profileImage}
                        alt="Profile Picture"
                        width={100}
                        height={100}
                        priority
                        className="rounded-full border-4 border-red-500 shadow-md"
                    />
                ) : (
                    defaultAvatar
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-6 ">
            <Link href={"/orders"}>
                <motion.button whileHover={{ scale: 1.1 }} className="border border-gray-700 px-6 py-3 rounded-md font-bold min-w-[120px]">
                    Orders
                </motion.button>
                </Link>
              <Link href={"/cart"}>
              <motion.button whileHover={{ scale: 1.1 }} className="border border-gray-700 px-6 py-3 rounded-md font-bold">
                    Your Cart
                </motion.button>
              </Link>
                <motion.button whileHover={{ scale: 1.1 }} className="border border-gray-700 px-6 py-3 rounded-md font-bold">
                    Wishlist
                </motion.button>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md w-full max-w-md mt-6">
                <div className="mb-4">
                    <label className="block text-gray-600">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 font-serif font-bold focus:outline-none bg-transparent text-black rounded-xl"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-600">Email</label>
                    <input
                        type="email"
                        value={session?.user?.email || ""}
                        readOnly
                        className="w-full p-4 bg-gray-200 font-serif font-bold border rounded text-gray-700 cursor-not-allowed"
                    />
                </div>
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    className="w-full bg-red-600 text-white p-5 rounded-xl hover:bg-red-700 transition-colors"
                >
                    Update Profile
                </motion.button>
            </form>

            <Toaster />
        </motion.div>
    );
}
