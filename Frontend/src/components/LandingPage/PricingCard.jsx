import React from 'react';
import PixelButton from './PixelButton';

export default function PricingCard({ title, price, features, isPopular, buttonText, buttonClass }) {
  return (
    <div className={`text-center bg-black/40 border-4 ${isPopular ? 'border-yellow-300 scale-105 shadow-[8px_8px_0_#b30000]' : 'border-black shadow-[8px_8px_0_#000]'} p-6 h-full flex flex-col relative`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-300 text-black font-bold px-4 py-1 border-2 border-black shadow-[2px_2px_0_#000] text-xs">
          POPULAR
        </div>
      )}
      <h3 className={`font-bold ${isPopular ? 'text-yellow-200' : 'text-red-200'} text-2xl mb-2`}>{title}</h3>
      <p className="text-4xl font-bold mb-4">{price}</p>
      <ul className={`text-left space-y-2 mb-6 ${isPopular ? 'text-yellow-100/90' : 'text-red-100/90'} text-sm flex-grow`}>
        {features.map((feature, idx) => (
          <li key={idx} dangerouslySetInnerHTML={{ __html: feature }} />
        ))}
      </ul>
      <PixelButton className={`w-full text-sm py-3 ${buttonClass || ''}`}>{buttonText}</PixelButton>
    </div>
  );
}
