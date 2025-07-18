'use client';

import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeShape, setActiveShape] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveShape((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized rendering engine for smooth drawing experience with complex diagrams.'
    },
    {
      icon: '👥',
      title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time. See cursors, edits, and comments instantly.'
    },
    {
      icon: '🎨',
      title: 'Rich Drawing Tools',
      description: 'Complete set of drawing tools including shapes, arrows, text, and freehand drawing.'
    },
    {
      icon: '📥',
      title: 'Export Anywhere',
      description: 'Export your creations as PNG, SVG, or PDF. Perfect for presentations and documentation.'
    },
    {
      icon: '🔗',
      title: 'Easy Sharing',
      description: 'Share your drawings with a simple link. Control permissions and collaboration settings.'
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your data is encrypted and secure. Choose between public, private, or team workspaces.'
    }
  ];

  return (
    // Make the main container relative
    <div className="min-h-screen w-screen bg-gray-900 text-white relative">
      {/* ADDED: Background Grid Layer */}
      <div 
    className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:1rem_1rem]"
 ></div>

      {/* Wrap all original content in a relative div with a higher z-index */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-semibold text-white">
                  Sketchify
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200">
                  Sign In
                </button>
                <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-200 font-medium">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-800 text-emerald-400 border border-gray-700">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                The future of collaborative drawing
              </span>
            </div>
            
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Sketch, Create,
                <br />
                <span className="text-emerald-400">Collaborate</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Transform your ideas into beautiful diagrams, wireframes, and illustrations with our powerful collaborative drawing platform.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-gray-400">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  Real-time collaboration
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  Infinite canvas
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  Lightning fast
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Start Drawing Now →
                </button>
                <button className="px-8 py-4 bg-transparent hover:bg-gray-800 text-white rounded-lg font-semibold text-lg transition-all duration-200 border border-gray-600 hover:border-gray-500">
                  Watch Demo
                </button>
              </div>

              <div className="text-center text-gray-400 text-sm mb-8">
                Trusted by thousands of creators worldwide
              </div>

              <div className="flex justify-center space-x-12 text-center">
                <div>
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-sm text-gray-400">Drawings Created</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Canvas Preview Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                See It In <span className="text-emerald-400">Action</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Watch how easy it is to create beautiful diagrams, sketches, and illustrations with our intuitive drawing tools.
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-4 right-4 flex items-center space-x-2 text-sm text-gray-400 z-10">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                3 collaborators online
              </div>

              {/* Canvas Container */}
              <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
                {/* Canvas Toolbar */}
                <div className="bg-gray-900 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-400 text-sm">untitled-sketch.draw</span>
                  </div>
                </div>

                {/* Canvas Area */}
                <div className="relative h-96 bg-gray-850 overflow-hidden">
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>

                  {/* Animated Shapes */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Rectangle */}
                    <div className={`absolute w-20 h-12 bg-purple-500 rounded transform transition-all duration-500 ${
                      activeShape === 0 ? 'scale-110 shadow-lg shadow-purple-500/30' : 'scale-100'
                    }`} style={{ top: '35%', left: '35%' }}>
                    </div>

                    {/* Circle */}
                    <div className={`absolute w-16 h-16 bg-emerald-500 rounded-full transform transition-all duration-500 ${
                      activeShape === 1 ? 'scale-110 shadow-lg shadow-emerald-500/30' : 'scale-100'
                    }`} style={{ top: '30%', right: '35%' }}>
                    </div>

                    {/* Triangle */}
                    <div className={`absolute transform transition-all duration-500 ${
                      activeShape === 2 ? 'scale-110' : 'scale-100'
                    }`} style={{ bottom: '35%', right: '30%' }}>
                      <div className="w-0 h-0 border-l-8 border-r-8 border-b-14 border-l-transparent border-r-transparent border-b-green-500"
                           style={{ borderLeftWidth: '16px', borderRightWidth: '16px', borderBottomWidth: '28px' }}>
                      </div>
                    </div>

                    {/* Curved Arrow */}
                    <svg className="absolute" style={{ bottom: '25%', left: '25%', width: '200px', height: '100px' }}>
                      <path 
                        d="M 20 60 Q 100 20 180 60" 
                        stroke="#10b981" 
                        strokeWidth="3" 
                        fill="none"
                        className={`transition-all duration-500 ${activeShape === 3 ? 'stroke-4' : 'stroke-3'}`}
                      />
                      <polygon 
                        points="175,55 185,60 175,65" 
                        fill="#10b981"
                        className={`transition-all duration-500 ${activeShape === 3 ? 'scale-110' : 'scale-100'}`}
                        style={{ transformOrigin: '180px 60px' }}
                      />
                    </svg>
                  </div>

                  {/* Auto-saved indicator */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-xs text-gray-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Auto-saved
                  </div>
                </div>
              </div>

              {/* Go to Canvas Button */}
              <div className="text-center mt-8">
                <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Go to Canvas →
                </button>
                <p className="text-sm text-gray-400 mt-2">No signup required • Start drawing instantly</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Everything You Need to <span className="text-emerald-400">Create</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Powerful features designed for creators, teams, and everyone in between. No compromises, just pure creative freedom.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:transform hover:-translate-y-1">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="text-xl font-semibold text-white">Sketchify</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  The modern collaborative drawing platform for creators and teams.
                </p>
                <div className="flex space-x-4">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                    <span className="text-gray-400">𝕏</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                    <span className="text-gray-400">in</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                    <span className="text-gray-400">@</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 Sketchify. All rights reserved.
              </div>
              <div className="flex space-x-6 text-gray-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>

            <div className="text-center mt-8 text-gray-500 text-xs">
              Built with care
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}