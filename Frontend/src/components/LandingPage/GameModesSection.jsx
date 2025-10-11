// components/LandingPage/GameModesSection.jsx
export default function GameModesSection() {
  const modes = [
    { 
      title: "Solo Training", 
      desc: "Practice at your own pace", 
      icon: "🧘",
      features: ["Unlimited Questions", "Progress Tracking", "Skill Trees"],
      color: "blue"
    },
    { 
      title: "Battle Arena", 
      desc: "Real-time PvP matches", 
      icon: "⚔️",
      features: ["Live Opponents", "Ranked Matches", "Tournaments"],
      color: "red"
    },
    { 
      title: "Team Quests", 
      desc: "Cooperative challenges", 
      icon: "👥",
      features: ["Group Challenges", "Shared Rewards", "Team Rankings"],
      color: "green"
    }
  ];

  return (
    <section id="game-modes" className="reveal">
      <h2 className="text-3xl md:text-5xl font-bold text-center text-shadow-pixel mb-16">
        Game Modes
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {modes.map((mode, index) => (
          <div key={index} className={`bg-black/40 backdrop-blur-sm border-4 border-${mode.color}-500 p-6 shadow-[8px_8px_0_#000] hover:shadow-[12px_12px_0_#b30000] hover:-translate-y-2 transition-all duration-300`}>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{mode.icon}</div>
              <h3 className="text-xl font-bold text-red-300 mb-2">{mode.title}</h3>
              <p className="text-red-200 text-sm mb-4">{mode.desc}</p>
            </div>
            <ul className="space-y-2">
              {mode.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-red-200 text-sm">
                  <span className="text-green-400 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}