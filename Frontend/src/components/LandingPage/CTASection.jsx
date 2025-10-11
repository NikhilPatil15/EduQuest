// components/LandingPage/CTASection.jsx
export default function CTASection() {
  return (
    <section id="cta" className="reveal text-center">
      <div className="bg-black/40 backdrop-blur-sm border-4 border-yellow-500 p-8 md:p-12 shadow-[12px_12px_0_#000] max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-shadow-pixel mb-6">
          Ready to Start Your Learning Adventure?
        </h2>
        <p className="text-xl text-red-200 mb-8 max-w-2xl mx-auto">
          Join thousands of trainers already leveling up their knowledge and having fun while learning!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-red-600 hover:bg-red-500 text-white border-4 border-black px-8 py-4 text-lg font-bold shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#000] hover:-translate-y-1 transition-all">
            Start Free Today
          </button>
          <button className="bg-transparent hover:bg-red-900/30 text-red-300 border-4 border-red-600 px-8 py-4 text-lg font-bold shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#b30000] hover:-translate-y-1 transition-all">
            Watch Demo Video
          </button>
        </div>
        <p className="text-red-300 mt-6 text-sm">
          No credit card required • 100% free to start • Join in 30 seconds
        </p>
      </div>
    </section>
  );
}