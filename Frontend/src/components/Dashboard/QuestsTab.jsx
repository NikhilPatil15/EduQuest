import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin'; // 👈 ADD THIS IMPORT

gsap.registerPlugin(TextPlugin); // 👈 AND REGISTER THE PLUGIN HERE

// --- POKEMON & QUIZ DATA (EXPANDED) ---
const pokemonSprites = {
  player: { name: 'Pikachu', sprite: 'https://play.pokemonshowdown.com/sprites/gen5ani-back/pikachu.gif' },
  Science: { name: 'Magneton', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/82.gif' },
  Math: { name: 'Drowzee', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/96.gif' },
  Coding: { name: 'Porygon', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/137.gif' },
};

// GIF for damage effect
const DAMAGE_EXPLOSION_GIF = 'https://s3.amazonaws.com/files.dorkly.com/assets/dorkly_fireball.gif'; // A pixelated explosion

const quizData = {
  Coding: {
    Easy: [
      { question: "What does HTML stand for?", options: ["Hyper Tool Markup Language", "Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Management Link"], answer: "Hyper Text Markup Language" },
      { question: "Which tag is used to create a paragraph in HTML?", options: ["<p>", "<h1>", "<div>", "<par>"], answer: "<p>" },
      { question: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Syntax", "Colorful Styling System"], answer: "Cascading Style Sheets" },
      { question: "Which symbol is used for single-line comments in JavaScript?", options: ["//", "/*", "#", "<!--"], answer: "//" }
    ],
    Medium: [
      { question: "Which of these is NOT a primitive data type in JavaScript?", options: ["String", "Number", "Array", "Boolean"], answer: "Array" },
      { question: "What is the purpose of a 'for' loop?", options: ["To declare a function", "To style an element", "To iterate over a block of code", "To handle user clicks"], answer: "To iterate over a block of code" },
      { question: "What does API stand for?", options: ["Application Programming Interface", "Advanced Program Interaction", "Automated Python Integration", "Applied Protocol Interface"], answer: "Application Programming Interface" },
      { question: "In CSS, what property is used to change the text color?", options: ["font-color", "text-color", "color", "font-style"], answer: "color" }
    ],
    Hard: [
      { question: "What is 'Big O notation' used to describe?", options: ["The size of a program", "The algorithm's time/space complexity", "The number of functions", "The type of data"], answer: "The algorithm's time/space complexity" },
      { question: "What is recursion?", options: ["A loop that never ends", "A function that calls itself", "A way to store data", "A type of variable"], answer: "A function that calls itself" },
      { question: "Which version control system is the most widely used?", options: ["SVN", "Mercurial", "Git", "CVS"], answer: "Git" },
      { question: "What does 'DOM' stand for in web development?", options: ["Document Object Model", "Data Object Module", "Digital Ordinance Map", "Desktop Organization Method"], answer: "Document Object Model" }
    ]
  },
  Science: {
    Easy: [
      { question: "What is the chemical symbol for water?", options: ["O₂", "H₂O", "CO₂", "NaCl"], answer: "H₂O" },
      { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
      { question: "What is the center of an atom called?", options: ["Electron", "Proton", "Molecule", "Nucleus"], answer: "Nucleus" },
      { question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" }
    ],
    Medium: [
      { question: "What is the most abundant gas in Earth's atmosphere?", options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon Dioxide"], answer: "Nitrogen" },
      { question: "What measurement scale is used to determine wind speed?", options: ["Richter", "Beaufort", "Kelvin", "pH"], answer: "Beaufort" },
      { question: "What is the hardest known natural material?", options: ["Gold", "Iron", "Quartz", "Diamond"], answer: "Diamond" },
      { question: "What is the process of a liquid turning into a gas called?", options: ["Condensation", "Evaporation", "Sublimation", "Freezing"], answer: "Evaporation" }
    ],
    Hard: [
      { question: "What is the name for the study of fungi?", options: ["Mycology", "Virology", "Botany", "Geology"], answer: "Mycology" },
      { question: "The Heisenberg Uncertainty Principle is related to what field?", options: ["Relativity", "Genetics", "Quantum Mechanics", "Acoustics"], answer: "Quantum Mechanics" },
      { question: "What is the chemical symbol for Gold?", options: ["Ag", "Go", "Au", "Gd"], answer: "Au" },
      { question: "What is escape velocity?", options: ["Speed of sound", "Speed of light", "Speed to exit gravity", "Rotational speed"], answer: "Speed to exit gravity" }
    ]
  },
  Math: {
    Easy: [
      { question: "What is 12 x 12?", options: ["144", "124", "156", "132"], answer: "144" },
      { question: "How many sides does a hexagon have?", options: ["5", "8", "6", "7"], answer: "6" },
      { question: "What is 25 + 9 - 4?", options: ["28", "30", "32", "20"], answer: "30" },
      { question: "How many degrees are in a right angle?", options: ["45", "90", "180", "360"], answer: "90" }
    ],
    Medium: [
      { question: "What is the square root of 625?", options: ["15", "25", "35", "45"], answer: "25" },
      { question: "What comes after a million, billion, and trillion?", options: ["Quadrillion", "Quintillion", "Sextillion", "Zillion"], answer: "Quadrillion" },
      { question: "What is the value of Pi to two decimal places?", options: ["3.12", "3.18", "3.16", "3.14"], answer: "3.14" },
      { question: "A prime number is a number greater than 1 with only two factors: 1 and itself. Is 51 a prime number?", options: ["Yes", "No"], answer: "No" }
    ],
    Hard: [
      { question: "In calculus, what is the derivative of x²?", options: ["2x", "x³/3", "x", "2"], answer: "2x" },
      { question: "What is the next prime number after 7?", options: ["9", "13", "11", "15"], answer: "11" },
      { question: "What is the sum of the interior angles of a triangle?", options: ["90°", "180°", "270°", "360°"], answer: "180°" },
      { question: "What does the 'C' represent in Roman numerals?", options: ["50", "100", "500", "1000"], answer: "100" }
    ]
  }
};


// --- REUSABLE COMPONENTS ---
// --- REUSABLE COMPONENTS ---
const PixelButton = ({ children, className = '', ...props }) => ( <button {...props} className={`relative select-none bg-[#b30000] text-white border-4 border-black px-6 py-3 font-bold shadow-[6px_6px_0px_#000] hover:bg-[#cc0000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-150 disabled:bg-gray-600 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed ${className}`}><span className="relative z-10">{children}</span></button>);

// CORRECTED DialogueBox
const DialogueBox = ({ text }) => {
    const textRef = useRef(null);
    useEffect(() => {
        if (textRef.current) {
            // Use the 'text' property for the plugin, not 'textContent'
            gsap.fromTo(textRef.current, 
                { text: '' }, 
                { text: text, duration: text.length * 0.03, ease: 'none' }
            );
        }
    }, [text]);
    return (
        <div className="bg-black/70 border-4 border-black p-4 shadow-[8px_8px_0_#000] min-h-[100px]">
            <p ref={textRef} className="text-2xl leading-tight"></p>
        </div>
    );
};

const HealthBar = ({ currentHp, maxHp, isPlayer = false }) => { const percentage = (currentHp / maxHp) * 100; const barColor = percentage > 50 ? 'bg-green-500' : percentage > 20 ? 'bg-yellow-500' : 'bg-red-600'; return ( <div className={`w-full bg-black/50 border-4 border-black p-1 shadow-[4px_4px_0_#000] ${isPlayer ? 'text-right' : 'text-left'}`}><div className={`h-4 ${barColor} transition-all duration-500`} style={{ width: `${percentage}%` }}></div><span className="font-bold text-sm px-2">{currentHp} / {maxHp}</span></div> );};
const BattleCharacter = ({ id, spriteUrl, name, hp, maxHp, isPlayer = false, showHit = false, className = '' }) => (
    <div className={`flex flex-col items-center gap-2 relative ${className}`}>
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
    const value = { gameState, settings, questions, currentQuestion: questions[currentQuestionIndex], currentQuestionIndex, score, startQuiz, answerQuestion, resetQuiz, playerHp, opponentHp, MAX_HP, };
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.keys(quizData).map(subject => (
                <div key={subject} onClick={() => handleUpdate('subject', subject)} className={`bg-black/40 border-4 p-6 shadow-[8px_8px_0_#000] cursor-pointer transition-all duration-200 hover:scale-105 hover:border-yellow-400 ${selection.subject === subject ? 'border-yellow-400 scale-105 shadow-[8px_8px_0_#eab308]' : 'border-black'}`}>
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
    const { currentQuestion, currentQuestionIndex, questions, answerQuestion, settings, playerHp, opponentHp, MAX_HP } = useQuiz();
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [timer, setTimer] = useState(15);
    const timerRef = useRef(null);
    const [showPlayerHit, setShowPlayerHit] = useState(false);
    const [showOpponentHit, setShowOpponentHit] = useState(false);

    const handleAnswer = useCallback((option) => {
        if (isAnimating || selectedAnswer) return;
        
        clearInterval(timerRef.current);
        setIsAnimating(true);
        setSelectedAnswer(option ?? 'Timeout');
        const isCorrect = option === currentQuestion.answer;
        
        const tl = gsap.timeline({
            onStart: () => {
                if (isCorrect) {
                    setShowOpponentHit(true);
                } else {
                    setShowPlayerHit(true);
                }
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
              .to("#opponent-char", { x: '+=10', yoyo: true, repeat: 3, duration: 0.08, filter: 'brightness(80%)' }, "<")
              .to("#opponent-char", { opacity: 0, repeat: 1, yoyo: true, duration: 0.1 }, "-=0.2");
        } else {
            tl.to("#opponent-char", { x: -40, duration: 0.1, ease: 'power2.in' })
              .to("#player-char", { x: 'random(-8, 8)', duration: 0.05, repeat: 5, yoyo: true, ease: 'power1.inOut' }, "<")
              .to("#player-char", { filter: 'brightness(80%) sepia(100%) hue-rotate(-20deg) saturate(200%)', duration: 0.1, yoyo: true, repeat: 1 }, "<")
              .to("#opponent-char", { x: 0, duration: 0.3, ease: 'power2.out' });
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
            handleAnswer(null);
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
            {/* Bottom Row: Battle Console (Dialogue and Options) */}
            <div className="bg-black/60 border-4 border-black p-4 shadow-[8px_8px_0_#000]">
                <p className="text-right text-yellow-300 mb-2 font-bold">Question {currentQuestionIndex + 1} / {questions.length}</p>
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
    const { score, questions, resetQuiz, playerHp, settings } = useQuiz();
    const isVictory = playerHp > 0;
    return (
        <div className="animate-fade-in text-center">
            {isVictory ? ( <div><h2 className="text-4xl md:text-6xl font-bold text-shadow-pixel text-yellow-300 mb-4">YOU WON!</h2><p className="text-xl mb-6">Your knowledge was super effective!</p></div>) : ( <div><h2 className="text-4xl md:text-6xl font-bold text-shadow-pixel text-red-500 mb-4">DEFEATED...</h2><p className="text-xl mb-6">Time to hit the books and train harder!</p></div>)}
            
            <div className="flex justify-center items-center gap-8 mb-8">
                 <img src={pokemonSprites.player.sprite} alt={pokemonSprites.player.name} className={`h-32 pixelated-rendering drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)] transition-all ${isVictory ? '' : 'grayscale'}`} />
                 <span className="text-4xl font-bold">VS</span>
                 <img src={pokemonSprites[settings.subject].sprite} alt={pokemonSprites[settings.subject].name} className="h-32 pixelated-rendering drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]" />
            </div>

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
        <style>{` @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'); body { background-color: #1a0a0a; transition: background-color 0.1s; } .quiz-page-container { background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIHZpZXdCb3g9IjAgMCA0IDQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMWEwYTBhIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDJINCIgc3Ryb2tlPSIjMDUwMjAyIiBzdHJva2Utd2lkdGg9IjAuNSI+PC9wYXRoPgo8L3N2Zz4='); } .font-pixel { font-family: 'Press Start 2P', cursive; } .text-shadow-pixel { text-shadow: 4px 4px 0 #000; } .text-shadow-pixel-white { text-shadow: 2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 2px 0 0 #fff, -2px 0 0 #fff; } .pixelated-rendering { image-rendering: pixelated; image-rendering: -moz-crisp-edges; } .animate-fade-in { animation: fadeIn 0.7s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } `}</style>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(255,136,68,0.2),rgba(179,0,0,0.15),transparent_80%)]"></div>
        <div aria-hidden className="absolute inset-0 -z-10" style={{ boxShadow: 'inset 0 0 180px 40px rgba(0,0,0,0.75)' }}></div>
        <header className="bg-black/50 border-b-4 border-red-600 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"><div className="container mx-auto px-4 py-4 text-center"><span className="font-bold text-2xl text-shadow-pixel bg-gradient-to-r from-white via-red-200 to-yellow-300 bg-clip-text text-transparent">EduQuest Arena</span></div></header>
        <main className="container mx-auto px-4 py-8 md:py-12"><div className="max-w-5xl mx-auto"><QuizFlow /></div></main>
      </div>
    </QuizProvider>
  );
}