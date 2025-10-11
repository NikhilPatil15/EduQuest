// components/LandingPage/LeaderboardSection.jsx
export default function LeaderboardSection() {
  const topTrainers = [
    { rank: 1, name: "Ash Ketchum", xp: "15,420", badge: "🏆" },
    { rank: 2, name: "Misty Water", xp: "14,890", badge: "🥈" },
    { rank: 3, name: "Brock Stone", xp: "13,750", badge: "🥉" },
    { rank: 4, name: "Gary Oak", xp: "12,340", badge: "⭐" },
    { rank: 5, name: "Dawn Light", xp: "11,980", badge: "⭐" }
  ];

  return (
    <section id="leaderboard" className="reveal">
      <h2 className="text-3xl md:text-5xl font-bold text-center text-shadow-pixel mb-16">
        Top Trainers Leaderboard
      </h2>
      <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur-sm border-4 border-black shadow-[8px_8px_0_#000] p-6">
        <div className="space-y-3">
          {topTrainers.map((trainer) => (
            <div key={trainer.rank} className="flex items-center justify-between bg-red-900/30 border-2 border-black p-4 hover:bg-red-900/50 transition-colors">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{trainer.badge}</span>
                <span className="font-bold text-yellow-300">#{trainer.rank}</span>
                <span className="text-red-200">{trainer.name}</span>
              </div>
              <div className="text-right">
                <div className="text-green-300 font-bold">{trainer.xp} XP</div>
                <div className="text-xs text-red-300">Champion Rank</div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-6 bg-red-600 hover:bg-red-500 text-white border-2 border-black py-3 font-bold shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-y-1 transition-all">
          View Full Leaderboard
        </button>
      </div>
    </section>
  );
}