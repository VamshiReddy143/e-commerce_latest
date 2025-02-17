import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useUserId = () => {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (status !== "authenticated") return;
      
      try {
        const response = await fetch("/api/user"); // 🔹 Fetches from our new API
        const data = await response.json();
        if (data.success) {
          setUserId(data.userId); // ✅ Store the validated user ID
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, [status]);

  return userId; // Returns the correct user ID
};
