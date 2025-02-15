"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react"; // Client-side signIn

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      // Call the login API route
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Invalid credentials");
      }

      // Use `signIn` from NextAuth to create session after successful login
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Do not automatically redirect
      });

      // Redirect to profile page after successful login
      router.push("/profile");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Login Error:", err.message);
      }
    }
  };

  return (
    <div  style={{
        backgroundImage: "url('/background.jpg')", width: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }} className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">LOGIN</h1>

      <form
         className="flex flex-col items-center p-10 gap-3 rounded-xl shadow-lg
                   bg-white/20 backdrop-blur-md border border-white/30"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="text-black px-5 p-2 rounded-md w-full focus:outline-none"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="text-black px-5 p-2 rounded-md w-full focus:outline-none"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <button
          className="py-2 px-4 rounded-xl mt-4 text-white bg-violet-600"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="flex mt-2 gap-2">
        <p className="text-white">Don&apos;t have an account?</p>
        <button onClick={() => router.push("/register")} className="text-[#bc9fdf]">
          Register
        </button>
      </div>
    </div>
  );
}
