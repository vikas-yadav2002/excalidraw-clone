import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-screen bg-gray-900 text-white">
      {/* Left Section: Creative Layout */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-8
                      bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900
                      shadow-xl relative overflow-hidden">
        {/* Abstract shapes/patterns for creativity */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-52 h-52 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-extrabold mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">
            Your App Name
          </h1>
          <p className="text-xl text-gray-300 max-w-md mx-auto">
            Securely access your account or join our vibrant community.
          </p>
          <p className="mt-6 text-md text-gray-400">
            "Innovation meets simplicity."
          </p>
        </div>
      </div>

      {/* Right Section: Authentication Forms (Children) */}
      <main className="flex flex-1 justify-center items-center p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;