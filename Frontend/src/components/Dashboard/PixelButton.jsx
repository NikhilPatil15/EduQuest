import React from 'react';

const PixelButton = ({ children, className = '', onClick, variant = 'primary', disabled = false }) => {
  const variants = {
    primary: 'bg-[#cc0000] hover:bg-[#ff0000] shadow-[6px_6px_0px_#000]',
    secondary: 'bg-[#0066cc] hover:bg-[#0088ff] shadow-[6px_6px_0px_#000]',
    success: 'bg-[#00aa00] hover:bg-[#00cc00] shadow-[6px_6px_0px_#000]',
    yellow: 'bg-[#ffcc00] hover:bg-[#ffdd00] shadow-[6px_6px_0px_#000] text-black'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed hover:bg-[#cc0000]';

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`relative select-none text-white border-4 border-black px-6 py-3 font-bold transition-all duration-150 ${
        variants[variant]
      } ${disabled ? disabledStyles : ''} ${className}`}
    >
      <span className="relative z-10 text-sm tracking-wider">{children}</span>
      <span className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,#ff4d4d,transparent_40%),radial-gradient(circle_at_70%_70%,#ff1a1a,transparent_40%)]"></span>
      <span className="pointer-events-none absolute -inset-1 rounded-sm border-2 border-red-400/60 blur-[1px]"></span>
    </button>
  );
};

export default PixelButton;