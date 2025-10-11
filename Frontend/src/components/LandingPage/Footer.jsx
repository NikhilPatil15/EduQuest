import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-black/80 border-t-4 border-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-500/10 rounded-full blur-lg"></div>
      </div>

      {/* Floating Poké Balls */}
      <div className="absolute top-0 left-10 transform -translate-y-1/2">
        <div className="w-8 h-8 bg-white border-2 border-black rounded-full relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 rounded-t-full border-b border-black"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white rounded-b-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black border border-gray-400 rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-0 right-10 transform -translate-y-1/2">
        <div className="w-8 h-8 bg-white border-2 border-black rounded-full relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 rounded-t-full border-b border-black"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white rounded-b-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black border border-gray-400 rounded-full"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-red-300 mb-4 text-shadow-pixel">EduQuest</h3>
            <p className="text-red-200 text-sm mb-4">
              Catch knowledge, evolve skills, and become the ultimate learning champion!
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <div className="w-8 h-8 bg-red-600 border-2 border-black rounded flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors">
                <span className="text-xs">🎮</span>
              </div>
              <div className="w-8 h-8 bg-blue-600 border-2 border-black rounded flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
                <span className="text-xs">📚</span>
              </div>
              <div className="w-8 h-8 bg-green-600 border-2 border-black rounded flex items-center justify-center cursor-pointer hover:bg-green-500 transition-colors">
                <span className="text-xs">🏆</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="font-bold text-red-300 mb-4 text-shadow-pixel">Quick Links</h4>
            <div className="space-y-2">
              <a href="#features" className="block text-red-200 hover:text-red-100 transition-colors text-sm">
                Features
              </a>
              <a href="#about" className="block text-red-200 hover:text-red-100 transition-colors text-sm">
                About
              </a>
              <a href="#battleground" className="block text-red-200 hover:text-red-100 transition-colors text-sm">
                Battle
              </a>
              <a href="#leaderboard" className="block text-red-200 hover:text-red-100 transition-colors text-sm">
                Leaderboard
              </a>
            </div>
          </div>

          {/* Contact/Info */}
          <div className="text-center md:text-right">
            <h4 className="font-bold text-red-300 mb-4 text-shadow-pixel">Trainer Hub</h4>
            <div className="space-y-2 text-sm">
              <p className="text-red-200">Level Up Your Learning</p>
              <p className="text-red-200">Join 10,000+ Trainers</p>
              <p className="text-red-200">24/7 Learning Adventures</p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-black/60 border-2 border-black rounded-lg p-4 mb-6 shadow-[4px_4px_0_#000]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-red-300 font-bold text-lg">150K+</div>
              <div className="text-red-200 text-xs">Questions Answered</div>
            </div>
            <div>
              <div className="text-yellow-300 font-bold text-lg">50K+</div>
              <div className="text-yellow-200 text-xs">Badges Earned</div>
            </div>
            <div>
              <div className="text-green-300 font-bold text-lg">10K+</div>
              <div className="text-green-200 text-xs">Active Trainers</div>
            </div>
            <div>
              <div className="text-blue-300 font-bold text-lg">24/7</div>
              <div className="text-blue-200 text-xs">Learning Time</div>
            </div>
          </div>
        </div>

        {/* Copyright and Social */}
        <div className="border-t border-red-900/50 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-red-300 font-bold text-shadow-pixel">
                Powered by <span className="text-red-400">EduQuest Team</span>
              </p>
              <p className="text-red-200 text-xs mt-1">© {currentYear} All rights reserved</p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="group relative">
                <div className="w-8 h-8 bg-gray-800 border-2 border-black rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-red-300 group-hover:text-red-200 transition-colors">📘</span>
                </div>
              </a>
              <a href="#" className="group relative">
                <div className="w-8 h-8 bg-gray-800 border-2 border-black rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-red-300 group-hover:text-red-200 transition-colors">🐦</span>
                </div>
              </a>
              <a href="#" className="group relative">
                <div className="w-8 h-8 bg-gray-800 border-2 border-black rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-red-300 group-hover:text-red-200 transition-colors">📷</span>
                </div>
              </a>
            </div>

            {/* CTA Button */}
            <button className="bg-red-600 hover:bg-red-500 text-white border-2 border-black px-4 py-2 text-sm font-bold shadow-[3px_3px_0_#000] hover:shadow-[4px_4px_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0_#000] transition-all duration-150 pixelated-rendering">
              Join Adventure
            </button>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-6 flex justify-center space-x-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-red-500 rounded-full opacity-60"
              style={{
                animation: `pulse 2s infinite ${i * 0.3}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </footer>
  );
}