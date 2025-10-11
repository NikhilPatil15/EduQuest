import React from 'react';

export default function PixelButton({ children, className = '', onClick, id }) {
  return (
    <button 
      id={id}
      onClick={onClick}
      className={`relative select-none bg-[#b30000] text-white border-4 border-black px-8 py-4 font-bold shadow-[6px_6px_0px_#000] hover:bg-[#cc0000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-150 ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,#ff4d4d,transparent_40%),radial-gradient(circle_at_70%_70%,#ff1a1a,transparent_40%)]"></span>
      <span className="pointer-events-none absolute -inset-1 rounded-sm border-2 border-red-400/60 blur-[1px]"></span>
      <span className="sparkles pointer-events-none absolute -top-2 left-2 w-2 h-2 bg-white shadow-[0_0_10px_#fff,0_0_20px_#ff4d4d]"></span>
      <span className="sparkles pointer-events-none absolute -bottom-2 right-4 w-1.5 h-1.5 bg-white shadow-[0_0_8px_#fff,0_0_14px_#ff4d4d]"></span>
    </button>
  );
}