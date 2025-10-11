// components/LandingPage/HowItWorksSection.jsx
export default function HowItWorksSection() {
  const steps = [
    { number: "01", title: "Create Account", desc: "Become a trainer and choose your starter", icon: "👤" },
    { number: "02", title: "Choose Subjects", desc: "Select your learning paths and topics", icon: "📚" },
    { number: "03", title: "Battle & Learn", desc: "Answer questions and defeat opponents", icon: "⚔️" },
    { number: "04", title: "Evolve Skills", desc: "Level up and unlock new abilities", icon: "✨" }
  ];

  return (
    <section id="how-it-works" className="reveal">
      <h2 className="text-3xl md:text-5xl font-bold text-center text-shadow-pixel mb-16">
        How To Become A Learning Champion
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="text-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-red-600 border-4 border-black shadow-[6px_6px_0_#000] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center text-sm font-bold">
                {step.number}
              </div>
            </div>
            <h3 className="text-xl font-bold text-red-300 mb-2">{step.title}</h3>
            <p className="text-red-200 text-sm">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}