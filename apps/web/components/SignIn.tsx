'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';



const SignInPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700
                    transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-tight">
        Welcome Back!
      </h2>

      {error && (
        <div className="bg-red-600 text-white px-4 py-2 mb-6 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-white bg-gray-700 leading-tight
                       focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500
                       transition duration-200 ease-in-out placeholder-gray-400"
            placeholder="your@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-8">
          <label htmlFor="password" className="block text-gray-300 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 text-white bg-gray-700 leading-tight
                       focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500
                       transition duration-200 ease-in-out placeholder-gray-400"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between mb-8">
          <Link href="/forgot-password">
            <p className="inline-block align-baseline font-bold text-sm text-blue-400 hover:text-blue-300 transition duration-200 ease-in-out cursor-pointer">
              Forgot Password?
            </p>
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800
                     text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline
                     transition duration-200 ease-in-out transform hover:scale-105 active:scale-95"
        >
          Sign In
        </button>

        <p className="text-center text-gray-400 text-sm mt-8">
          Don't have an account?{' '}
          <Link href="/signup">
            <span className="font-bold text-blue-400 hover:text-blue-300 transition duration-200 ease-in-out cursor-pointer">
              Sign Up
            </span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignInPage;
