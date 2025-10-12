import React from "react";
import { NavLink } from "react-router-dom";

export default function Battleground() {
  return (
    <div className="absolute inset-0" id="battleground" data-parallax="0.25">
      {/* Background layers (non-interactive) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 bottom-28 h-40 opacity-70 pixel-mountains"></div>
        <div className="absolute inset-x-0 bottom-0 h-28 pixel-tile pixel-tile-ground border-t-4 border-black"></div>

        {/* Floating embers */}
        <div id="bg-embers" className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <span
              key={i}
              className="ember absolute w-1 h-1 bg-red-300/80"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 40}%`,
                boxShadow: "0 0 10px #ff4d4d",
              }}
            ></span>
          ))}
        </div>

        {/* Heat shimmer effect */}
        <div
          id="heat-shimmer"
          className="absolute inset-x-0 bottom-0 h-40 opacity-10"
          style={{
            background: "linear-gradient(0deg, rgba(255,77,77,0.15), transparent 60%)",
            filter: "blur(2px)",
          }}
        ></div>

        {/* Left Pokémon */}
        <img
          id="pokemon-left"
          className="absolute left-8 md:left-12 bottom-6 w-[280px] md:w-[380px] lg:w-[590px] pixelated-rendering drop-shadow-[8px_8px_0_#000]"
          style={{ transform: "scaleX(-1)" }}
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif"
          alt="Charizard facing right"
        />

        {/* Right Pokémon */}
        <img
          id="pokemon-right"
          className="absolute right-8 md:right-12 bottom-6 w-[270px] md:w-[370px] lg:w-[590px] pixelated-rendering drop-shadow-[8px_8px_0_#000]"
          style={{ transform: "scaleX(1)" }}
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/248.gif"
          alt="Tyranitar facing left"
        />
      </div>

      {/* ✅ Move button outside the pointer-events-none div */}
      <div className="absolute inset-x-0 bottom-16 z-[9999] flex justify-center">
        <NavLink
          to="/login"
          className="practice-btn group bg-[#ff0000] hover:bg-[#ff3333] text-white border-4 border-black px-8 py-4 md:px-10 md:py-4 font-bold shadow-[8px_8px_0_#000] hover:shadow-[10px_10px_0_#000] hover:-translate-y-2 active:translate-y-0 active:shadow-[4px_4px_0_#000] transition-all duration-200 pixelated-rendering relative overflow-hidden min-w-[200px]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <span className="relative z-10 text-lg md:text-xl text-shadow-pixel">
            START PRACTICING
          </span>

          <span
            className="sparkle absolute top-2 right-3 w-3 h-3 bg-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
            style={{ boxShadow: "0 0 12px #ffd700, 0 0 24px #ffaa00" }}
          ></span>
          <span
            className="sparkle absolute bottom-2 left-3 w-2 h-2 bg-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 rounded-full"
            style={{ boxShadow: "0 0 8px #ffd700, 0 0 16px #ffaa00" }}
          ></span>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="battle-particle absolute w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100"
                style={{
                  left: `${15 + i * 25}%`,
                  bottom: "-4px",
                  animation: `particle-rise 1s ease-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              ></div>
            ))}
          </div>
        </NavLink>
      </div>

      <style>{`
        @keyframes particle-rise {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-30px) scale(0); opacity: 0; }
        }

        .practice-btn { filter: drop-shadow(0 0 10px rgba(255,0,0,0.5)); }
        .practice-btn:hover { filter: drop-shadow(0 0 15px rgba(255,0,0,0.7)); }
      `}</style>
    </div>
  );
}
