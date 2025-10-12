import React, { useState, useEffect } from 'react';
// Assuming PixelButton is imported from './PixelButton'

// --- Placeholder for PixelButton component ---
const PixelButton = ({ children, variant = 'primary', className, onClick, disabled }) => {
    const baseClasses = "font-bold border-4 border-black transition-all duration-150 active:translate-y-0 active:shadow-[2px_2px_0_#000]";
    let variantClasses = '';
    
    switch (variant) {
        case 'primary':
            variantClasses = "bg-red-700 text-white shadow-[4px_4px_0_#000] hover:bg-red-800 disabled:bg-gray-500 disabled:shadow-[2px_2px_0_#000] disabled:cursor-not-allowed";
            break;
        case 'success':
            variantClasses = "bg-green-700 text-white shadow-[4px_4px_0_#000] hover:bg-green-800 disabled:bg-gray-500 disabled:shadow-[2px_2px_0_#000] disabled:cursor-not-allowed";
            break;
        default:
            variantClasses = "bg-gray-700 text-white shadow-[4px_4px_0_#000] hover:bg-gray-800 disabled:bg-gray-500 disabled:shadow-[2px_2px_0_#000] disabled:cursor-not-allowed";
    }

    return (
        <button
            className={`${baseClasses} ${variantClasses} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};
// ---------------------------------------------


// === QUIZ RESULTS CARD COMPONENT (Used for FINAL results) ===
const QuizResultsCard = ({ results, onClose }) => {
    // Logic remains the same
    const totalCorrect = results.filter(r => r.isCorrect).length;
    const totalXP = results.reduce((sum, r) => sum + r.xpEarned, 0);
    const totalCoins = results.reduce((sum, r) => sum + r.coinsEarned, 0);
    const totalQuestions = results.length;
    const accuracy = Math.round((totalCorrect / totalQuestions) * 100) || 0;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[70] p-4">
            <div className="bg-gradient-to-br from-[#100000] to-[#600000] border-4 border-black p-8 rounded-lg shadow-[10px_10px_0_#ffcc00] max-w-md w-full text-white text-center">
                
                <h3 className="text-4xl font-extrabold text-yellow-300 mb-4 pixelated-text">
                    QUEST COMPLETE!
                </h3>
                <p className="text-lg mb-6">Your training session results:</p>
                
                <div className="bg-black/50 p-4 rounded mb-6 border-2 border-gray-700">
                    <div className="flex justify-between text-xl font-bold mb-2">
                        <span>Accuracy:</span>
                        <span className="text-green-400">{accuracy}%</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold mb-2">
                        <span>Score:</span>
                        <span className="text-white">{totalCorrect} / {totalQuestions}</span>
                    </div>
                </div>

                <div className="flex justify-around mb-8">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-yellow-300">+{totalXP}</p>
                        <span className="text-sm">XP Earned</span>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-yellow-300">+{totalCoins}</p>
                        <span className="text-sm">Coins Found</span>
                    </div>
                </div>

                <PixelButton
                    variant="success"
                    className="w-full py-3 text-lg"
                    onClick={onClose}
                >
                    RETURN TO QUESTS
                </PixelButton>
            </div>
        </div>
    );
};
// ===================================


// === INTEGRATED QUIZ PANEL COMPONENT (Replaces QuizQuestionViewer) ===
const IntegratedQuizPanel = ({ session, onAnswerSubmit, onClose }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [lastResult, setLastResult] = useState(null); // Stores last result for inline display
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Clear selection/result for new question when session updates
    useEffect(() => {
        setSelectedAnswer(null);
        setLastResult(null);
        setIsSubmitting(false);
    }, [session.currentQuestion._id]);


    // Handles the client-side interaction: checks answer, sets result, and calls parent
    const handleSubmit = () => {
        if (!selectedAnswer || isSubmitting) return;

        setIsSubmitting(true);
        const isCorrect = selectedAnswer === session.currentQuestion.correctAnswer;
        
        // --- API Submission Simulation ---
        const simulatedResponse = {
            isCorrect: isCorrect,
            correctAnswer: session.currentQuestion.correctAnswer,
            explanation: isCorrect ? session.currentQuestion.explanation : `The correct answer was ${session.currentQuestion.correctAnswer}. ${session.currentQuestion.explanation}`,
            xpEarned: isCorrect ? 100 : 0,
            coinsEarned: isCorrect ? 10 : 0,
            currentStreak: isCorrect ? session.currentStreak + 1 : 0,
            isCompleted: session.progress.current === session.progress.total,
            nextQuestion: isCorrect && session.progress.current < session.progress.total ? {
                _id: "q_next_002",
                question: "What is the primary function of chlorophyll?",
                questionType: "multiple_choice",
                options: ["Respiration", "Photosynthesis", "Digestion", "Reproduction"],
                correctAnswer: "Photosynthesis",
                explanation: "Chlorophyll is essential for plants to convert light energy into chemical energy.",
                timeLimit: 20
            } : null
        };

        // Display result inline first
        setLastResult(simulatedResponse);
        
        // Then pass it back to the parent component after a short delay
        // (Simulating network latency before processing the next step)
        setTimeout(() => {
            onAnswerSubmit(simulatedResponse, session.sessionId);
            setIsSubmitting(false);
        }, 1000); 
    };
    
    // Handles continuing to the next step (called after reviewing lastResult)
    const handleContinue = () => {
        if (!lastResult) return;
        
        // Triggers the state updates in the parent component (QuestsTab)
        onAnswerSubmit(lastResult, session.sessionId);
    };

    const isAnswerSubmitted = lastResult !== null;
    const isCompleted = lastResult?.isCompleted;

    const resultMessage = lastResult ? (
        <div className={`mt-4 p-3 border-2 border-black rounded ${lastResult.isCorrect ? 'bg-green-700' : 'bg-red-700'}`}>
            <p className="font-bold text-lg">{lastResult.isCorrect ? 'Correct!' : 'Incorrect!'}</p>
            <p className="text-sm">{lastResult.explanation}</p>
        </div>
    ) : null;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[70] p-4">
            <div className="bg-gradient-to-br from-[#100000] to-[#400000] border-4 border-black p-6 rounded-lg shadow-[10px_10px_0_#000] max-w-xl w-full text-white">
                
                {/* Header and Progress */}
                <div className="flex justify-between items-center pb-3 border-b border-yellow-500 mb-4">
                    <h3 className="text-2xl font-bold text-yellow-300">
                        QUEST QUIZ
                    </h3>
                    <div className="text-right">
                        <span className="text-lg font-bold block">
                            Q: {session.progress.current} / {session.progress.total}
                        </span>
                        <button onClick={onClose} className="text-xs text-gray-400 hover:text-red-400">
                            (Quit Session)
                        </button>
                    </div>
                </div>

                {/* Question */}
                <div className="text-center mb-6">
                    <p className="text-3xl font-extrabold mt-2 text-white pixelated-text">
                        {session.currentQuestion.question}
                    </p>
                </div>

                {/* Answer Options (Disabled when submitted) */}
                <div className="space-y-3 mb-6">
                    {session.currentQuestion.options.map((option, index) => (
                        <div
                            key={index}
                            className={`p-3 border-2 border-black rounded transition-all ${
                                isAnswerSubmitted ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-black/80'
                            } ${
                                selectedAnswer === option 
                                ? 'bg-blue-600 shadow-[4px_4px_0_#000] border-white' 
                                : 'bg-black/50 shadow-[2px_2px_0_#000]'
                            }`}
                            onClick={() => !isAnswerSubmitted && setSelectedAnswer(option)}
                        >
                            <span className="font-mono text-lg">{option}</span>
                        </div>
                    ))}
                </div>

                {/* Submit/Continue Button Area */}
                <div className="h-20 flex flex-col justify-end">
                    {isAnswerSubmitted ? (
                        <PixelButton
                            variant={isCompleted ? 'success' : (lastResult.isCorrect ? 'success' : 'primary')}
                            className="w-full py-3 text-xl animate-pulse"
                            onClick={handleContinue}
                            disabled={isSubmitting}
                        >
                            {isCompleted ? 'VIEW RESULTS' : 'CONTINUE'}
                        </PixelButton>
                    ) : (
                        <PixelButton
                            variant="primary"
                            className="w-full py-3 text-xl"
                            onClick={handleSubmit}
                            disabled={!selectedAnswer || isSubmitting}
                        >
                            {isSubmitting ? 'PROCESSING...' : 'SUBMIT ANSWER'}
                        </PixelButton>
                    )}
                </div>

                {/* Inline Result Message */}
                {resultMessage}
            </div>
        </div>
    );
};
// ===================================


const QuestsTab = ({ trainerData }) => {
    const [activeQuest, setActiveQuest] = useState(null); 
    const [quizSession, setQuizSession] = useState(null); 
    const [resultAlert, setResultAlert] = useState(null); // This state is now redundant but kept for structure compatibility
    const [quizResultsData, setQuizResultsData] = useState([]); 
    
    // --- DUMMY DATA ---
    const questsData = [
        { 
            name: 'MATH PRACTICE: ALGEBRA', 
            type: 'quiz', 
            subject: 'math', 
            questionCount: 2, 
            reward: '50 COINS', 
            progress: 3, 
            total: 10, 
            completed: false, 
            gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif',
            isAdaptive: false,
            description: "Complete a standard 2-question quiz on Algebraic Fundamentals.",
            nextQuestionData: {
                _id: "q1_math",
                question: "If 3x + 5 = 17, what is the value of x?",
                questionType: "multiple_choice",
                options: ["3", "4", "5", "6"],
                correctAnswer: "4",
                explanation: "3x = 12, therefore x = 4."
            }
        },
        { 
            name: 'ADAPTIVE SCIENCE QUIZ', 
            type: 'quiz', 
            subject: 'science', 
            questionCount: 8, 
            reward: '100 XP', 
            progress: 0, 
            total: 1, 
            completed: false, 
            gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif',
            isAdaptive: true,
            description: "Challenge yourself with an adaptive quiz that adjusts difficulty based on your answers.",
            nextQuestionData: {
                _id: "q1_science",
                question: "Which organelle is the 'powerhouse' of the cell?",
                questionType: "multiple_choice",
                options: ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"],
                correctAnswer: "Mitochondria",
                explanation: "Mitochondria generate ATP."
            }
        },
        { 
            name: '7-DAY STREAK (IN PROGRESS)', 
            type: 'streak', 
            subject: null, 
            reward: '200 COINS', 
            progress: 6, 
            total: 7, 
            completed: false, 
            gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/38.gif',
            isAdaptive: false,
            description: "Log in and complete any quiz quest for 7 days in a row."
        },
    ];
    // ------------------------------------

    const availableDifficulties = ['beginner', 'intermediate', 'advanced'];

    const handleStartQuest = (quest) => {
        if (quest.type === 'quiz' && !quest.isAdaptive) {
            setActiveQuest(quest);
        } else if (quest.type === 'quiz' && quest.isAdaptive) {
            handleLaunchQuiz(null, quest); 
        } else {
            alert(`Quest ${quest.name} activated! (Non-quiz action simulated)`);
        }
    };
    
    const handleLaunchQuiz = (difficulty, questOverride = null) => {
        const quest = questOverride || activeQuest;
        if (!quest) return;

        let route;
        let requestBody;
        
        if (quest.isAdaptive) {
            route = '/api/v1/quizzes/start-adaptive';
            requestBody = { subject: quest.subject, questionCount: quest.questionCount };
        } else {
            route = '/api/v1/quizzes/start';
            requestBody = { subject: quest.subject, difficulty: difficulty, questionCount: quest.questionCount, useAdaptive: false };
        }
        
        const simulatedResponse = {
            success: true,
            data: {
                sessionId: `sess_${Math.random().toString(16).slice(2)}`,
                currentQuestion: quest.nextQuestionData,
                progress: { current: 1, total: quest.questionCount },
                currentStreak: 0
            }
        };

        setQuizResultsData([]); // Clear previous results
        setQuizSession({ ...simulatedResponse.data, subject: quest.subject });
        setActiveQuest(null); 
    };

    // FIXED: Simplified the answer submission handler to manage the inline result and state transition
    const handleAnswerSubmit = (responseData, sessionId) => {
        // 1. Log the result
        setQuizResultsData(prev => [...prev, responseData]);
        
        // 2. If completed, end the session cleanly
        if (responseData.isCompleted) {
            setQuizSession(null);
            console.log(`Quiz completed! Results data is stored and ready for display.`);
        } else if (responseData.nextQuestion) {
            // 3. Otherwise, prepare the session for the next question
            setQuizSession(prev => ({
                ...prev,
                currentQuestion: responseData.nextQuestion,
                progress: {
                    ...prev.progress,
                    current: prev.progress.current + 1
                },
                currentStreak: responseData.currentStreak
            }));
        }
        // Note: The IntegratedQuizPanel handles setting the inline result (lastResult) automatically.
    };

    const handleCloseResultsCard = () => {
        setQuizResultsData([]); // Clear results after closing card
    };

    const handleCloseSession = () => {
        if (window.confirm("Are you sure you want to quit this quiz session? Your progress will be lost.")) {
            setQuizSession(null);
            setQuizResultsData([]); // Clear any partial results
        }
    };


    // --- Difficulty Selection Modal Component ---
    const DifficultySelectionModal = ({ quest }) => (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#600000] to-[#400000] border-4 border-black rounded-lg shadow-[8px_8px_0_#000] max-w-lg w-full p-6 text-white">
                <h3 className="text-2xl font-bold text-yellow-300 mb-2">{quest.name}</h3>
                <p className="text-gray-300 mb-6">Select a difficulty for this {quest.subject.toUpperCase()} quiz:</p>
                
                <div className="space-y-4">
                    {availableDifficulties.map((difficulty) => (
                        <PixelButton 
                            key={difficulty}
                            variant="primary"
                            className="w-full py-3 text-lg tracking-wider capitalize"
                            onClick={() => handleLaunchQuiz(difficulty)}
                        >
                            {difficulty} ({quest.questionCount} Questions)
                        </PixelButton>
                    ))}
                </div>

                <PixelButton 
                    variant="default"
                    className="w-full py-2 text-sm mt-6 bg-gray-700 hover:bg-gray-800"
                    onClick={() => setActiveQuest(null)}
                >
                    Cancel
                </PixelButton>
            </div>
        </div>
    );
    // ---------------------------------------------


    // RENDER LOGIC
    // We check the states in order of dominance: Results > Quiz > Difficulty > Quest List
    return (
        <>
            <h2 className="text-3xl font-bold text-center text-shadow-pixel mb-8 text-[#ffcc00]">🎯 DAILY QUESTS</h2>
            
            {/* 1. QUIZ RESULTS CARD (Highest Priority) */}
            {quizResultsData.length > 0 && !quizSession && (
                <QuizResultsCard results={quizResultsData} onClose={handleCloseResultsCard} />
            )}

            {/* 2. QUIZ VIEWER (Next Priority) */}
            {quizSession && (
                <IntegratedQuizPanel 
                    session={quizSession}
                    onAnswerSubmit={handleAnswerSubmit}
                    onClose={handleCloseSession}
                    key={quizSession.currentQuestion._id}
                />
            )}
            
            {/* 3. MAIN QUEST LIST (Rendered when IDLE or Difficulty Modal is open underneath) */}
            {!quizSession && quizResultsData.length === 0 && (
                <>
                    <div className="space-y-4">
                        {questsData.map((quest, index) => {
                            const progressPercent = (quest.progress / quest.total) * 100;
                            const primaryActionText = quest.type === 'quiz' ? '🎯 START QUIZ' : '⚡ VIEW PROGRESS';

                            return (
                                <div key={index} className="dashboard-card bg-gradient-to-br from-[#600000] to-[#400000] border-4 border-black p-5 rounded-lg shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#cc0000] hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-white border-4 border-black rounded flex items-center justify-center shadow-[3px_3px_0_#000]">
                                                <img 
                                                    src={quest.gif}
                                                    alt={quest.name}
                                                    className="w-10 h-10 pixelated-rendering pokemon-gif"
                                                />
                                            </div>
                                            <h3 className="font-bold text-xl text-shadow-pixel tracking-wider">
                                                {quest.name}
                                                {quest.isAdaptive && <span className="ml-2 text-xs bg-purple-600 px-2 py-1 rounded border border-black shadow-[1px_1px_0_#000]">ADAPTIVE</span>}
                                            </h3>
                                        </div>
                                        <span className="text-sm bg-[#ffcc00] px-3 py-1 border-2 border-black font-bold shadow-[2px_2px_0_#000] tracking-wider text-black">
                                            REWARD: {quest.reward}
                                        </span>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-300 mb-2">{quest.description}</p>
                                        <div className="flex justify-between text-sm mb-2 font-bold tracking-wider">
                                            <span>PROGRESS</span>
                                            <span>{quest.progress}/{quest.total}</span>
                                        </div>
                                        <div className="w-full bg-[#300000] border-2 border-black h-4 shadow-[2px_2px_0_#000]">
                                            <div 
                                                className={`progress-bar h-full transition-all duration-500 pixelated-rendering ${
                                                    quest.completed ? 'bg-gradient-to-r from-[#00cc00] to-[#00ff00]' : 'bg-gradient-to-r from-[#0066cc] to-[#0088ff]'
                                                }`}
                                                style={{ width: `${progressPercent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    <PixelButton 
                                        variant={quest.completed ? 'success' : 'primary'}
                                        className="w-full py-3 text-lg tracking-wider"
                                        onClick={() => handleStartQuest(quest)}
                                        disabled={quest.completed}
                                    >
                                        {quest.completed ? '✅ CLAIMED' : primaryActionText}
                                    </PixelButton>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="mt-6 p-4 bg-gradient-to-r from-[#ffcc00]/20 to-[#ffaa00]/20 border-2 border-[#ffcc00] rounded-lg">
                        <div className="text-center font-bold text-lg text-[#ffcc00] tracking-wider mb-2">
                            DAILY QUEST PROGRESS SUMMARY
                        </div>
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span>QUIZ QUESTS PENDING: {questsData.filter(q => q.type === 'quiz' && !q.completed).length}</span>
                            <span>TOTAL REWARDS CLAIMED: {questsData.filter(q => q.completed).map(q => q.reward).join(', ')}</span> 
                        </div>
                    </div>
                </>
            )}

            {/* 4. Render Difficulty Modal (Overlays main content, z-index 50) */}
            {activeQuest && <DifficultySelectionModal quest={activeQuest} />}
        </>
    );
};

export default QuestsTab;