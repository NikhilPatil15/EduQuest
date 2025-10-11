import React from 'react';
import PricingCard from './PricingCard';

export default function PricingSection() {
  return (
    <section id="pricing" className="reveal py-16">
      <h2 className="text-3xl md:text-5xl font-bold text-center text-shadow-pixel mb-12">Choose Your Adventure</h2>
      <div className="grid md:grid-cols-3 gap-8 items-center">
        <div className="pricing-card-wrapper transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
          <PricingCard 
            title="1 Month Pass"
            price="$10"
            features={[
              '✓ Access to all quests',
              '✓ Track your progress',
              '✓ Basic trainer support'
            ]}
            buttonText="Start Quest"
          />
        </div>
        
        <div className="pricing-card-wrapper transform transition-all duration-300 hover:scale-110 hover:-translate-y-3 hover:z-10">
          <PricingCard 
            title="6 Month Quest"
            price="$50"
            features={[
              '✓ Everything in 1 Month Pass',
              '✓ <span class="font-bold">Save $10</span>',
              '✓ Priority support',
              '✓ Exclusive trainer badges'
            ]}
            isPopular
            buttonText="Evolve Skills"
            buttonClass="bg-yellow-500 hover:bg-yellow-600 !text-black shadow-[6px_6px_0px_#000]"
          />
        </div>
        
        <div className="pricing-card-wrapper transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
          <PricingCard 
            title="1 Year Journey"
            price="$90"
            features={[
              '✓ Everything in 6 Month Quest',
              '✓ <span class="font-bold">Save $30</span>',
              '✓ Early access to new content'
            ]}
            buttonText="Go Legendary"
          />
        </div>
      </div>

      <style jsx>{`
        .pricing-card-wrapper {
          position: relative;
        }
        
        .pricing-card-wrapper::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: linear-gradient(45deg, #ff0000, #ff6600, #ffaa00, #ff0000);
          background-size: 300% 300%;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.3s ease;
          filter: blur(8px);
          animation: gradient-rotate 3s linear infinite;
        }
        
        .pricing-card-wrapper:hover::before {
          opacity: 0.6;
        }
        
        .pricing-card-wrapper:nth-child(2)::before {
          background: linear-gradient(45deg, #ffaa00, #ffd700, #ffff00, #ffaa00);
        }
        
        @keyframes gradient-rotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Add sparkle effect on hover */
        .pricing-card-wrapper:hover {
          filter: drop-shadow(0 0 20px rgba(255, 77, 77, 0.4));
        }
        
        .pricing-card-wrapper:nth-child(2):hover {
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
        }
      `}</style>
    </section>
  );
}

export { PricingSection };