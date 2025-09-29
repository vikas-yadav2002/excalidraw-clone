"use client";

import axios from "axios";
import Link from "next/link";
import React from "react";

const SignUpPage: React.FC = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const response = await axios.post(
        `http://localhost:3003/api/v1/auth/signup`,
        {
          email,
          name,
          password,
        }
      );

      if (response.status === 201) {
        window.location.href = "/signin";
       console.log(name, email, password);
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (err) {
      alert("Signup failed from catch. Please try again.");
      console.error("Signup error:", err);
    }

      
  };

  return (
    <div
      className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700
                    transform hover:scale-105 transition-transform duration-300 ease-in-out"
    >
      <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-tight">
        Join Us!
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="name"
            id="name"
            className="block text-gray-300 text-sm font-semibold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-white bg-gray-700 leading-tight
                       focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500
                       transition duration-200 ease-in-out placeholder-gray-400"
            placeholder="John Doe"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-gray-300 text-sm font-semibold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-white bg-gray-700 leading-tight
                       focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500
                       transition duration-200 ease-in-out placeholder-gray-400"
            placeholder="your@example.com"
            required
          />
        </div>
        <div className="mb-8">
          <label
            htmlFor="password"
            className="block text-gray-300 text-sm font-semibold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-white bg-gray-700 leading-tight
                       focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500
                       transition duration-200 ease-in-out placeholder-gray-400"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800
                     text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline
                     transition duration-200 ease-in-out transform hover:scale-105 active:scale-95"
        >
          Sign Up
        </button>
        <p className="text-center text-gray-400 text-sm mt-8">
          Already have an account?{" "}
          <Link href="/signin">
            <span className="font-bold text-blue-400 hover:text-blue-300 transition duration-200 ease-in-out cursor-pointer">
              Sign In
            </span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
