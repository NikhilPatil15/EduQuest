import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

// --- POKEMON & QUIZ DATA ---
const pokemonSprites = {
  player: { name: 'Pikachu', sprite: 'https://play.pokemonshowdown.com/sprites/gen5ani-back/pikachu.gif' },
  Science: { name: 'Magneton', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/82.gif' },
  History: { name: 'Ponyta', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/77.gif' },
  Math: { name: 'Drowzee', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/96.gif' },
};

// GIF for damage effect
const DAMAGE_EXPLOSION_GIF = 'https://s3.amazonaws.com/files.dorkly.com/assets/dorkly_fireball.gif'; // A pixelated explosion

const quizData = {
  Science: {
    Easy: [ { question: "What is the chemical symbol for water?", options: ["O2", "H2O", "CO2", "NaCl"], answer: "H2O" }, { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" }, ],
    Medium: [ { question: "What is the most abundant gas in Earth's atmosphere?", options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon Dioxide"], answer: "Nitrogen"}, { question: "What measurement scale is used to determine wind speed?", options: ["Richter", "Beaufort", "Kelvin", "pH"], answer: "Beaufort"}, ],
    Hard: [ { question: "What is the name for the study of fungi?", options: ["Mycology", "Virology", "Botany", "Geology"], answer: "Mycology"}, { question: "The Heisenberg Uncertainty Principle is related to what field?", options: ["Relativity", "Genetics", "Quantum Mechanics", "Acoustics"], answer: "Quantum Mechanics"}, ]
  },
  History: {
    Easy: [ { question: "Who was the first President of the United States?", options: ["A. Lincoln", "G. Washington", "T. Jefferson", "J. Adams"], answer: "G. Washington" }, { question: "In which year did the Titanic sink?", options: ["1905", "1912", "1918", "1923"], answer: "1912" }, ],
    Medium: [ { question: "The Magna Carta was a charter of rights signed in what country?", options: ["France", "Spain", "Germany", "England"], answer: "England"}, { question: "The ancient city of Rome was built on how many hills?", options: ["Five", "Seven", "Nine", "Three"], answer: "Seven"}, ],
    Hard: [ { question: "The Treaty of Westphalia in 1648 ended which major European conflict?", options: ["Hundred Years' War", "Napoleonic Wars", "Thirty Years' War", "War of Roses"], answer: "Thirty Years' War"}, { question: "Who was the last pharaoh of Ptolemaic Egypt?", options: ["Tutankhamun", "Ramesses II", "Akhenaten", "Cleopatra VII"], answer: "Cleopatra VII"}, ]
  },
  Math: {
    Easy: [ { question: "What is 12 x 12?", options: ["144", "124", "156", "132"], answer: "144" }, { question: "How many sides does a hexagon have?", options: ["5", "8", "6", "7"], answer: "6" }, ],
    Medium: [ { question: "What is the square root of 625?", options: ["15", "25", "35", "45"], answer: "25"}, { question: "What comes after a million, billion, and trillion?", options: ["Quadrillion", "Quintillion", "Sextillion", "Zillion"], answer: "Quadrillion"}, ],
    Hard: [ { question: "In calculus, what is the derivative of x²?", options: ["2x", "x³/3", "x", "2"], answer: "2x"}, { question: "What is the next prime number after 7?", options: ["9", "13", "11", "15"], answer: "11"}, ]
  }
};

// --- REUSABLE COMPONENTS ---
const PixelButton = ({ children, className = '', ...props }) => ( <button {...props} className={`relative select-none bg-[#b30000] text-white border-4 border-black px-6 py-3 font-bold shadow-[6px_6px_0px_#000] hover:bg-[#cc0000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-150 disabled:bg-gray-600 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed ${className}`}><span className="relative z-10">{children}</span></button>);
const DialogueBox = ({ text }) => { const textRef = useRef(null); useEffect(() => { if (textRef.current) { gsap.fromTo(textRef.current, { textContent: '' }, { textContent: text, duration: text.length * 0.03, ease: 'none', snap: { textContent: 1 } }); } }, [text]); return ( <div className="bg-black/70 border-4 border-black p-4 shadow-[8px_8px_0_#000] min-h-[100px]"><p ref={textRef} className="text-2xl leading-tight"></p></div> );};
const HealthBar = ({ currentHp, maxHp, isPlayer = false }) => { const percentage = (currentHp / maxHp) * 100; const barColor = percentage > 50 ? 'bg-green-500' : percentage > 20 ? 'bg-yellow-500' : 'bg-red-600'; return ( <div className={`w-full bg-black/50 border-4 border-black p-1 shadow-[4px_4px_0_#000] ${isPlayer ? 'text-right' : 'text-left'}`}><div className={`h-4 ${barColor} transition-all duration-500`} style={{ width: `${percentage}%` }}></div><span className="font-bold text-sm px-2">{currentHp} / {maxHp}</span></div> );};

// UPDATED BattleCharacter to include damage visual effects
const BattleCharacter = ({ id, spriteUrl, name, hp, maxHp, isPlayer = false, showHit = false }) => (
  <div className="flex flex-col items-center gap-2 relative">
    {showHit && (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <img src={DAMAGE_EXPLOSION_GIF} alt="Hit" className="w-24 h-24 pixelated-rendering" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-pixel text-4xl text-red-500 text-shadow-pixel-white">HIT!</span>
      </div>
    )}
    <img id={id} src={spriteUrl} alt={name} className="h-32 md:h-48 pixelated-rendering drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]" />
    <div className="w-48">
      <h3 className="font-bold text-lg mb-1">{name}</h3>
      <HealthBar currentHp={hp} maxHp={maxHp} isPlayer={isPlayer} />
    </div>
  </div>
);


// --- QUIZ CONTEXT ---
const QuizContext = createContext();
export const QuizProvider = ({ children }) => {
    const [gameState, setGameState] = useState('selection');
    const [settings, setSettings] = useState({ subject: 'Science', difficulty: 'Easy' });
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [playerHp, setPlayerHp] = useState(100);
    const [opponentHp, setOpponentHp] = useState(100);
    const MAX_HP = 100;

    useEffect(() => {
        if (gameState !== 'in_progress') return;
        const isGameOver = playerHp <= 0 || opponentHp <= 0 || currentQuestionIndex >= questions.length;
        if (isGameOver) {
            const timer = setTimeout(() => { setGameState('finished'); }, 1200); 
            return () => clearTimeout(timer);
        }
    }, [playerHp, opponentHp, currentQuestionIndex, questions.length, gameState]);

    const startQuiz = (newSettings) => {
        setSettings(newSettings);
        const fetchedQuestions = quizData[newSettings.subject]?.[newSettings.difficulty] || [];
        setQuestions(fetchedQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setPlayerHp(MAX_HP);
        setOpponentHp(MAX_HP);
        setGameState('in_progress');
    };

    const answerQuestion = (isCorrect) => {
        let baseDamage = 20;
        if (settings.difficulty === 'Medium') baseDamage = 25;
        if (settings.difficulty === 'Hard') baseDamage = 35;
        const damage = baseDamage + Math.floor(Math.random() * 8);

        if (isCorrect) {
            setScore(prev => prev + 1);
            setOpponentHp(prev => Math.max(0, prev - damage));
        } else {
            setPlayerHp(prev => Math.max(0, prev - damage));
        }

        setTimeout(() => {
            setCurrentQuestionIndex(prev => prev + 1);
        }, 2000);
    };
    
    const resetQuiz = () => setGameState('selection');
    const value = { gameState, settings, questions, currentQuestion: questions[currentQuestionIndex], score, startQuiz, answerQuestion, resetQuiz, playerHp, opponentHp, MAX_HP, };
    return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
export const useQuiz = () => useContext(QuizContext);

// --- PAGE COMPONENTS ---

function QuizSelection() {
    const { startQuiz } = useQuiz();
    const [selection, setSelection] = useState({ subject: 'Science', difficulty: 'Easy' });
    const handleUpdate = (type, value) => { setSelection(prev => ({...prev, [type]: value})); }
    return (
      <div className="animate-fade-in text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-shadow-pixel mb-8">CHOOSE YOUR CHALLENGE!</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.keys(quizData).map(subject => (
                <div key={subject} onClick={() => handleUpdate('subject', subject)} className={`bg-black/40 border-4 p-6 shadow-[8px_8px_0_#000] cursor-pointer transition-transform duration-200 hover:scale-105 ${selection.subject === subject ? 'border-yellow-400' : 'border-black'}`}>
                    <img src={pokemonSprites[subject].sprite} alt={pokemonSprites[subject].name} className="h-32 mx-auto pixelated-rendering" />
                    <h3 className="text-2xl font-bold mt-4">{subject}</h3>
                    <p className="text-yellow-300">{pokemonSprites[subject].name}</p>
                </div>
            ))}
        </div>
        <div className="mt-12">
            <h3 className="text-2xl font-bold text-shadow-pixel mb-4">SELECT DIFFICULTY</h3>
            <div className="flex justify-center gap-4">
                {['Easy', 'Medium', 'Hard'].map(level => (
                    <button key={level} onClick={() => handleUpdate('difficulty', level)} className={`border-4 text-lg border-black px-6 py-3 font-bold shadow-[4px_4px_0_#000] transition-all duration-150 ${selection.difficulty === level ? 'bg-yellow-400 text-black' : 'bg-black/40 hover:bg-red-900/50'}`}>{level}</button>
                ))}
            </div>
        </div>
        <div className="mt-12"><PixelButton onClick={() => startQuiz(selection)}>Start Battle!</PixelButton></div>
      </div>
    );
}

function QuizSession() {
    const { currentQuestion, answerQuestion, settings, playerHp, opponentHp, MAX_HP } = useQuiz();
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [timer, setTimer] = useState(15);
    const timerRef = useRef(null);
    const [showPlayerHit, setShowPlayerHit] = useState(false);
    const [showOpponentHit, setShowOpponentHit] = useState(false);

    // Use useCallback to memoize handleAnswer so it's stable for useEffect
    const handleAnswer = useCallback((option) => {
        if (isAnimating || selectedAnswer) return;
        
        clearInterval(timerRef.current); // Stop timer on answer
        setIsAnimating(true);
        setSelectedAnswer(option ?? 'Timeout'); // Use 'Timeout' if option is null
        const isCorrect = option === currentQuestion.answer;
        
        const tl = gsap.timeline({
            onStart: () => {
                if (isCorrect) {
                    setShowOpponentHit(true);
                } else {
                    setShowPlayerHit(true);
                }
                 // Screen shake for any hit
                gsap.to(".quiz-page-container", { x: 'random(-5, 5)', y: 'random(-5, 5)', duration: 0.1, repeat: 3, yoyo: true, ease: 'power1.inOut', clearProps: 'x,y' });
            },
            onComplete: () => {
                answerQuestion(isCorrect);
                setIsAnimating(false);
                setShowPlayerHit(false);
                setShowOpponentHit(false);
            }
        });

        if (isCorrect) {
            tl.to("#player-char", { x: 20, repeat: 1, yoyo: true, duration: 0.15 })
              .to("#opponent-char", { x: '+=10', yoyo: true, repeat: 3, duration: 0.08, filter: 'brightness(80%)' }, "<") // Flash opponent
              .to("#opponent-char", { opacity: 0, repeat: 1, yoyo: true, duration: 0.1 }, "-=0.2"); // Briefly fade
        } else {
            tl.to("#opponent-char", { x: -40, duration: 0.1, ease: 'power2.in' }) // Opponent lunges forward
              .to("#player-char", { x: 'random(-8, 8)', duration: 0.05, repeat: 5, yoyo: true, ease: 'power1.inOut' }, "<") // Player shakes
              .to("#player-char", { filter: 'brightness(80%) sepia(100%) hue-rotate(-20deg) saturate(200%)', duration: 0.1, yoyo: true, repeat: 1 }, "<") // Player flashes red
              .to("#opponent-char", { x: 0, duration: 0.3, ease: 'power2.out' }); // Opponent returns
        }
    }, [isAnimating, selectedAnswer, currentQuestion, answerQuestion]);


    useEffect(() => {
        setSelectedAnswer(null);
        setTimer(15);

        timerRef.current = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [currentQuestion]);

    useEffect(() => {
        if (timer === 0) {
            clearInterval(timerRef.current);
            handleAnswer(null); // Pass null to indicate timeout
        }
    }, [timer, handleAnswer]);
    
    const getButtonClass = (option) => { if (!selectedAnswer) return 'hover:bg-[#cc0000]'; if (option === currentQuestion.answer) return '!bg-green-600 !shadow-none'; if (option === selectedAnswer) return '!bg-red-800 !shadow-none'; return '!bg-gray-700 !shadow-none opacity-60'; };
    
    if (!currentQuestion) return null;

    return (
        <div className="animate-fade-in flex flex-col h-[75vh]">
            {/* Top Row: Characters and Timer */}
            <div className="flex-grow flex justify-between items-center px-4 relative">
                <BattleCharacter id="player-char" spriteUrl={pokemonSprites.player.sprite} name={pokemonSprites.player.name} hp={playerHp} maxHp={MAX_HP} isPlayer showHit={showPlayerHit} />
                {/* TIMER UI */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 flex items-center justify-center font-bold text-4xl border-4 border-black bg-black/50 rounded-full shadow-[4px_4px_0_#000] transition-colors duration-300 ${timer <= 5 ? 'text-red-500' : 'text-yellow-300'}`}>
                    {timer}
                </div>
                <BattleCharacter id="opponent-char" spriteUrl={pokemonSprites[settings.subject].sprite} name={pokemonSprites[settings.subject].name} hp={opponentHp} maxHp={MAX_HP} showHit={showOpponentHit} />
            </div>
            {/* Bottom Row: Dialogue and Options */}
            <div>
                <DialogueBox text={currentQuestion.question} />
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {currentQuestion.options.map(option => (
                        <PixelButton key={option} onClick={() => handleAnswer(option)} disabled={!!selectedAnswer} className={`w-full text-sm md:text-base !px-2 transition-colors duration-300 ${getButtonClass(option)}`}>{option}</PixelButton>
                    ))}
                </div>
            </div>
        </div>
    );
}

function QuizResults() {
    const { score, questions, resetQuiz, playerHp } = useQuiz();
    const isVictory = playerHp > 0;
    return (
        <div className="animate-fade-in text-center">
            {isVictory ? ( <div><h2 className="text-4xl md:text-6xl font-bold text-shadow-pixel text-yellow-300 mb-4">YOU WON!</h2><p className="text-xl mb-8">Your knowledge was super effective!</p></div>) : ( <div><h2 className="text-4xl md:text-6xl font-bold text-shadow-pixel text-red-500 mb-4">DEFEATED...</h2><p className="text-xl mb-8">Time to hit the books and train harder!</p></div>)}
            <div className="bg-black/40 border-4 border-black p-8 shadow-[8px_8px_0_#000] max-w-lg mx-auto">
                <h3 className="text-2xl font-bold mb-4">Battle Summary</h3>
                <div className="text-left space-y-2">
                    <p className="text-xl">Correct Answers: <span className="font-bold text-green-400">{score} / {questions.length}</span></p>
                    <p className="text-xl">XP Gained: <span className="font-bold text-yellow-300">+{score * 150}</span></p>
                    <p className="text-xl">HP Remaining: <span className="font-bold text-red-400">{playerHp}</span></p>
                </div>
            </div>
            <div className="mt-12"><PixelButton onClick={resetQuiz} className="bg-blue-700 hover:bg-blue-800">Rematch!</PixelButton></div>
        </div>
    );
}

// --- MAIN APP COMPONENT ---
export default function QuizPage() {
  const QuizFlow = () => { const { gameState } = useQuiz(); switch (gameState) { case 'in_progress': return <QuizSession />; case 'finished': return <QuizResults />; default: return <QuizSelection />; } };
  return (
    <QuizProvider>
      <div className="min-h-screen text-white overflow-hidden relative font-pixel bg-[#1a0a0a] quiz-page-container">
        <style>{` @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'); body { background-color: #1a0a0a; transition: background-color 0.1s; } .font-pixel { font-family: 'Press Start 2P', cursive; } .text-shadow-pixel { text-shadow: 4px 4px 0 #000; } .text-shadow-pixel-white { text-shadow: 2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 2px 0 0 #fff, -2px 0 0 #fff; } .pixelated-rendering { image-rendering: pixelated; image-rendering: -moz-crisp-edges; } .animate-fade-in { animation: fadeIn 0.7s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } `}</style>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(255,136,68,0.2),rgba(179,0,0,0.15),transparent_80%)]"></div>
        <div aria-hidden className="absolute inset-0 -z-10" style={{ boxShadow: 'inset 0 0 180px 40px rgba(0,0,0,0.75)' }}></div>
        <header className="bg-black/50 border-b-4 border-red-600 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"><div className="container mx-auto px-4 py-4 text-center"><span className="font-bold text-2xl text-shadow-pixel bg-gradient-to-r from-white via-red-200 to-yellow-300 bg-clip-text text-transparent">EduQuest Arena</span></div></header>
        <main className="container mx-auto px-4 py-8 md:py-12"><div className="max-w-5xl mx-auto"><QuizFlow /></div></main>
      </div>
    </QuizProvider>
    
  );
}