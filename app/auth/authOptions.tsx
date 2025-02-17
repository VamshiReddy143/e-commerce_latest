import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { Session, User as NextAuthUser } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import dbConnect from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password", placeholder: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("User not found");
        }

        // Prevent credential login for Google users
        if (!user.password) {
          throw new Error("This email is registered via Google. Please use Google sign-in.");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return { 
          id: user._id.toString(), 
          email: user.email, 
          name: user.name, 
          isAdmin: user.isAdmin 
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: NextAuthUser; account?: any }) {
      await dbConnect();

      if (account?.provider === "google") {
        let existingUser = await User.findOne({ email: user?.email });

        if (!existingUser) {
          existingUser = await User.create({
            googleId: user?.id,
            email: user?.email,
            name: user?.name,
            image: user?.image || "",
            password: null, 
            isAdmin: false, 
          });
        }

        token.id = existingUser._id.toString();
        token.isAdmin = existingUser.isAdmin; // Add isAdmin here
      } else if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isAdmin = user?.isAdmin; // Add isAdmin here
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.isAdmin = token.isAdmin as boolean; // Add isAdmin here
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
