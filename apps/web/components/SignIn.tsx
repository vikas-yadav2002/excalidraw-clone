"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
// import { HTTP_BACKEND_URL } from "../config/links"; // This is commented out but available if you need it

const SignInPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Restored state for form inputs, errors, and loading status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Restored the form submission logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:3003/api/v1/auth/signin`,
        {
          email,
          password,
        }
      );

      const { token, message, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", user.name);
        console.log("Sign-in successful. Token stored.");
        const redirectTo = searchParams.get("redirect") || "/room";
        router.push(redirectTo);
      } else {
        setError(
          message ||
            "Sign-in successful, but no token received. Please try again."
        );
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message || "An error occurred during sign-in."
        );
      } else {
        setError("Network error or unexpected issue. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Welcome Back!
        </h2>

        {/* Conditionally rendered error message */}
        {error && (
          <div className="bg-red-600/90 text-white px-4 py-2 mb-6 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-gray-300 text-sm font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-white bg-gray-700 leading-tight
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                         transition duration-200 ease-in-out placeholder-gray-400"
              placeholder="your@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-300 text-sm font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-white bg-gray-700 leading-tight
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                         transition duration-200 ease-in-out placeholder-gray-400"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <div className="text-right mb-6">
            <Link href="/forgot-password">
              <span className="font-semibold text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-200 cursor-pointer">
                Forgot Password?
              </span>
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600
                       text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline
                       transition-all duration-200 transform hover:scale-105 active:scale-100
                       disabled:bg-emerald-700 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-gray-400 text-sm mt-8">
            Don't have an account?{" "}
            <Link href="/signup">
              <span className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors duration-200 cursor-pointer">
                Sign Up
              </span>
            </Link>
          </p>
        </form>
      </div>
  );
};

export default SignInPage;