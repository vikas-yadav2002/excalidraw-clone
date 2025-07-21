import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full text-white">
      
      {/* Left Section: Panel with Grid Background */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gray-900 relative p-8">
        
        {/* Grid Layer (local to this div) */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>

        {/* Content Layer (sits on top of the grid) */}
        <div className="relative z-10 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
              Sketchify
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-md">
            Securely access your account or join our vibrant community.
          </p>
          <p className="mt-6 text-md text-gray-500 italic">
            "Innovation meets simplicity."
          </p>
        </div>
      </div>

      {/* Right Section: Solid Background for Auth Forms */}
      <main className="w-full lg:w-1/2 flex justify-center items-center bg-gray-900 p-4 sm:p-6 lg:p-8">
        {children}
      </main>

    </div>
  );
};

export default AuthLayout;