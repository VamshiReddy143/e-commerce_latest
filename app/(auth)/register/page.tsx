"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const response = await axios.post("/api/auth/register", data);

      if (response.data.success) {
        const loginResponse = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (!loginResponse || loginResponse.error) {
          toast.error("Login failed: " + loginResponse?.error);
          return;
        }

        toast.success("Registration successful!");
        router.push("/");
      } else {
        toast.error(response.data.message || "Registration failed");
        
      }
    } catch {
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div style={{
      backgroundImage: "url('/background.jpg')", width: "100%",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }} className="flex flex-col items-center  justify-center h-screen">
      <h1 className="text-4xl  font-bold mb-4 ">SIGN UP</h1>

      <form
        className="flex flex-col items-center p-10 gap-3 rounded-xl shadow-lg
                   bg-white/0 backdrop-blur-md border border-white/20"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Name Field */}
        <input
          {...register("name")}
          className="text-black bg-transparent border border-gray-400  px-5 p-2 rounded-xl w-full focus:outline-none  "
          type="text"
          placeholder="Name"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        {/* Email Field */}
        <input
          {...register("email")}
          className="text-black bg-transparent border border-gray-400  px-5 p-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
          type="email"
          placeholder="Email"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        {/* Password Field */}
        <input
          {...register("password")}
          className="text-black bg-transparent border border-gray-400  px-5 p-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
          type="password"
          placeholder="Password"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        {/* Submit Button */}
        <button
          className="bg-red-600 py-3 px-10 rounded-xl mt-4 text-white hover:bg-red-700 transition"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        {/* Divider */}
        <div className="h-[3px] mt-2 bg-white w-full" />

        {/* Google Sign-In Button */}
        <button
  type="button"
  onClick={handleGoogleSignIn}
  className="bg-white flex items-center gap-3 py-2 px-4 rounded-xl mt-4 text-black  transition"
>
  <Image
    src="/google.png"
    alt="Google Logo"
    width={20} // Adjust size to fit well
    height={20}
    className="h-6 w-6" // Ensures proper scaling
  />
  Sign in with Google
</button>

      </form>

      {/* Login Redirect */}
      <div className="flex mt-5 gap-2">
        <p className="text-white">Already have an account?</p>
        <button onClick={() => router.push("/login")} className="text-red-400 font-bold">
          Login
        </button>
      <Toaster  position="top-center" reverseOrder={false} />
      </div>
    </div>
  );
}
