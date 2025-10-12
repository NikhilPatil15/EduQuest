import React, { useState } from "react";

// --- Placeholder for PixelButton component ---
const PixelButton = ({ children, variant = "primary", className, onClick }) => {
  const baseClasses =
    "font-bold border-4 border-black transition-all duration-150 active:translate-y-0 active:shadow-[2px_2px_0_#000]";
  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses =
        "bg-red-700 text-white shadow-[4px_4px_0_#000] hover:bg-red-800";
      break;
    case "success":
      variantClasses =
        "bg-green-700 text-white shadow-[4px_4px_0_#000] hover:bg-green-800";
      break;
    default:
      variantClasses =
        "bg-gray-700 text-white shadow-[4px_4px_0_#000] hover:bg-gray-800";
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
// ---------------------------------------------

// === FLASHCARD VIEWER COMPONENT (Fixed Flip Logic) ===
const FlashcardViewer = ({ material, closeViewer }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const cards = material.flashcardData || [];
  const currentCard = cards[currentCardIndex];

  const totalCards = cards.length;

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % totalCards);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  if (cards.length === 0) {
    // ... (Error state UI remains the same)
  }

  const cardType =
    currentCardIndex === totalCards - 1 && currentCard.type === "imp_topic"
      ? "imp_topic"
      : "normal";

  const frontLabel =
    cardType === "imp_topic" ? "SUMMARY / KEY TAKEAWAY" : "CONCEPT / QUESTION";
  const backLabel =
    cardType === "imp_topic" ? "EXPLANATION" : "ANSWER / DEFINITION";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
      <div className="dashboard-card bg-gradient-to-br from-[#600000] to-[#400000] border-4 border-black p-6 rounded-lg shadow-[8px_8px_0_#000] max-w-2xl w-full">
        <div className="flex justify-between items-center mb-2 border-b pb-3 border-gray-700">
          <h3 className="text-2xl font-bold text-yellow-300">
            🧠 {material.title}
          </h3>
          <button
            onClick={closeViewer}
            className="text-2xl hover:text-red-400 transition-colors font-bold"
          >
            ×
          </button>
        </div>

        {/* Explainer Text / Content */}
        <p className="text-sm text-gray-400 mb-4">{material.content}</p>

        {/* Card Container */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          // Conditional styling for the final 'Important Topic' card
          className={`h-64 border-4 rounded-lg flex items-center justify-center text-center cursor-pointer perspective-1000 mb-6 transition-all duration-300 ${
            cardType === "imp_topic"
              ? "bg-red-800/80 border-red-400 hover:shadow-[0_0_20px_rgba(255,100,100,0.8)]"
              : "bg-black/60 border-yellow-300 hover:shadow-[0_0_20px_rgba(255,255,0,0.5)]"
          }`}
        >
          {/* Core flip container. Rotation is applied here. transform-style-preserve-3d is essential. */}
          <div
            className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-700 ${
              isFlipped ? "rotate-y-180 " : ""
            }`}
          >
            {/* Card Front (CONCEPT - Default View) */}
            {/* backface-hidden prevents the front content from being seen when the card is rotated 180deg */}
            <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-4">
              <span className="text-xs text-gray-400 mb-2">{frontLabel}</span>
              <p
                // Cleaned up class name. The content should always be rendered.
                className={` ${isFlipped ? "hidden " : ""} font-extrabold ${
                  cardType === "imp_topic"
                    ? "text-3xl text-yellow-300"
                    : "text-3xl text-white"
                }`}
                dangerouslySetInnerHTML={{ __html: currentCard.term }}
              />

              {/* Flip Hint */}
              <p className="absolute bottom-2 text-xs text-yellow-500 animate-pulse">
                CLICK TO FLIP 🔄
              </p>
            </div>

            {/* Card Back (ANSWER - Flipped View) */}
            {/* The rotate-y-180 positions the back face ready to be flipped into view. */}
            <div
              className={`${
                isFlipped ? " " : "backface-hidden"
              } absolute w-full h-full  rotate-y-180 flex flex-col items-center justify-center p-4 bg-black/80 rounded-lg`}
            >
              <span className="text-xs text-yellow-300 mb-2">{backLabel}</span>
              <p
                className="text-lg font-medium text-gray-200"
                dangerouslySetInnerHTML={{ __html: currentCard.definition }}
              />
              {/* Flip Hint */}
              <p className="absolute bottom-2 text-xs text-yellow-500 animate-pulse">
                CLICK TO FLIP 🔄
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <PixelButton onClick={handlePrev} className="px-4 py-2">
            ◀️ Previous
          </PixelButton>
          <span className="text-lg font-bold">
            Card {currentCardIndex + 1} / {totalCards}
          </span>
          <PixelButton onClick={handleNext} className="px-4 py-2">
            Next ▶️
          </PixelButton>
        </div>
      </div>
    </div>
  );
};
// === END FLASHCARD VIEWER COMPONENT ===
const LearnTab = ({ trainerData }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [flashcardMaterial, setFlashcardMaterial] = useState(null);
  const [moduleFilter, setModuleFilter] = useState("");

  const subjects = {
    math: {
      name: "Mathematics",
      icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png", // Dragonite
      description:
        "Master numbers, algebra, geometry, and problem-solving skills",
    },
    science: {
      name: "Science",
      icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png", // Bulbasaur
      description:
        "Explore physics, chemistry, biology, and scientific methods",
    },
    history: {
      name: "History",
      icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png", // Gyarados (ancient power!)
      description:
        "Discover world history, civilizations, and historical events",
    },
  };
  // Data structure with plain text math formulas
  const learningModules = {
    math: [
      {
        id: "math_1",
        name: "ALGEBRA FUNDAMENTALS",
        difficulty: "INTERMEDIATE",
        xp: 200,
        duration: "25 MIN",
        gif: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png",
        submodules: [
          // Submodule 1: Need of Algebra
          {
            id: "math_1_need",
            title: "Need of Algebra (Introduction)",
            content:
              "This section explains the fundamental rationale for using algebraic concepts across different scientific and real-world applications.",
            icon: "❓",
            flashcardData: [
              {
                term: "Why do we use letters in math?",
                definition:
                  "Letters (variables) allow us to represent **unknown quantities** or universal values, making formulas applicable across many problems.",
              },
              {
                term: "How does Algebra improve logic?",
                definition:
                  "It teaches **step-by-step logical reasoning** and balancing, which is crucial for complex problem-solving in any field.",
              },
              {
                term: "Algebra in **Science**?",
                definition:
                  "Used to rearrange and solve **physics equations** (like calculating force or velocity) and balance chemical equations.",
              },
              {
                term: "Algebra in **Technology**?",
                definition:
                  "It is the foundation of **computer programming** and algorithm development, particularly in game logic and data processing.",
              },
              {
                term: "FINAL CARD: Need Summary",
                definition:
                  "Algebra is the **universal language of logic and relationship**. It allows us to move beyond specific numbers to understand patterns and structures.",
                type: "imp_topic",
              },
            ],
          },
          // Submodule 2: Key Terminology
          {
            id: "math_1_terms",
            title: "Key Terminology",
            content:
              "Drill the core vocabulary required before solving algebraic equations.",
            icon: "🏷️",
            flashcardData: [
              {
                term: "What is a **Variable**?",
                definition:
                  "A symbol (usually a letter) representing a quantity that may change.",
              },
              {
                term: "What is a **Coefficient**?",
                definition:
                  "The numerical factor multiplied by a variable in an algebraic term (e.g., '3' in 3x).",
              },
              {
                term: "What are **Like Terms**?",
                definition:
                  "Terms whose variables and exponents are identical.",
              },
              {
                term: "What is an **Equation**?",
                definition:
                  "A statement that two expressions are equal, separated by an equal sign (e.g., 3x + 1 = 10).",
              },
              {
                term: "What is an **Expression**?",
                definition:
                  "A combination of numbers, variables, and operation symbols, but NO equal sign (e.g., 5x^2 - 4).",
              },
              {
                term: "FINAL CARD: Important Topics",
                definition:
                  "Master **Combining Like Terms** and the **Distributive Property** as they are essential for all future algebra concepts.",
                type: "imp_topic",
              },
            ],
          },
        ],
      },
      // Statistics Module
      {
        id: "math_13",
        name: "STATISTICS: Measures of Central Tendency",
        difficulty: "ADVANCED",
        xp: 300,
        duration: "45 MIN",
        gif: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
        submodules: [
          {
            id: "math_13_mean",
            title: "Mean Calculation Formulas",
            content:
              "Review the formulas and methods for calculating the mean of grouped data sets.",
            icon: "📊",
            flashcardData: [
              {
                term: "What does the symbol Σ mean?",
                definition:
                  "It is the Greek capital letter **Sigma**. In math, it denotes the **summation** (adding up) of a series of numbers.",
              },
              {
                term: "Mean (Direct Method)",
                definition:
                  "Formula: **x̄ = (Σ fᵢ xᵢ) / (Σ fᵢ)**. Requires calculating the product of frequency (fᵢ) and class midpoint (xᵢ).",
              },
              {
                term: "Mean (Assumed Mean Method)",
                definition:
                  "Formula: **x̄ = a + (Σ fᵢ dᵢ) / (Σ fᵢ)**. More efficient for large numbers, where 'a' is the assumed mean.",
              },
              {
                term: "Median Formula",
                definition:
                  "Formula: **Median = L + [ (n/2 - cf) / f ] * h**. (Where L is lower limit, n/2 is half the total, cf is cumulative frequency, f is frequency, h is class size).",
              },
              {
                term: "Empirical Relationship",
                definition:
                  "The approximate relationship between the three measures: **3 Median ≈ Mode + 2 Mean**.",
              },
              {
                term: "FINAL CARD: Statistics Focus",
                definition:
                  "The median is **unaffected by extreme values** (outliers), making it a more robust measure of central tendency than the mean in skewed datasets.",
                type: "imp_topic",
              },
            ],
          },
        ],
      },
      // Probability Module
      {
        id: "math_14",
        name: "PROBABILITY BASICS",
        difficulty: "INTERMEDIATE",
        xp: 220,
        duration: "35 MIN",
        gif: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
        submodules: [
          {
            id: "math_14_basics",
            title: "Core Probability Concepts",
            content:
              "Fundamentals including event definition, range, and common examples.",
            icon: "🎲",
            flashcardData: [
              {
                term: "What is **Probability**?",
                definition:
                  "A numerical measure of the likelihood that a specific event will occur.",
              },
              {
                term: "The basic calculation for P(E)",
                definition:
                  "P(E) = (Number of outcomes favorable to E) / (Total number of possible outcomes).",
              },
              {
                term: "What is the **Range of Probability**?",
                definition:
                  "For any event E, the probability P(E) is always between 0 and 1, inclusive: **0 ≤ P(E) ≤ 1**.",
              },
              {
                term: "Probability of a **Sure Event**?",
                definition:
                  "The probability of an event that is certain to happen is **1**.",
              },
              {
                term: "Probability of an **Impossible Event**?",
                definition:
                  "The probability of an event that cannot happen is **0**.",
              },
              {
                term: "FINAL CARD: Probability Focus",
                definition:
                  "Remember that the sum of the probability of an event happening (P(E)) and not happening (P(Ē)) must always equal 1: **P(E) + P(Ē) = 1**.",
                type: "imp_topic",
              },
            ],
          },
        ],
      },
    ],
    science: [],
    history: [],
  };

  const difficultyColors = {
    BEGINNER: "bg-green-600",
    INTERMEDIATE: "bg-yellow-500 text-black",
    ADVANCED: "bg-red-600",
  };

  const allModules = learningModules[selectedSubject] || [];

  // Filter modules based on the filter text input
  const filteredModules = allModules.filter((module) =>
    module.name.toLowerCase().includes(moduleFilter.toLowerCase())
  );

  const handleSubjectSelect = (key) => {
    setSelectedSubject(key);
    setSelectedModule(null);
    setModuleFilter("");
  };

  const openModuleDetails = (module) => {
    setSelectedModule(module);
  };

  const closeModuleDetails = () => {
    setSelectedModule(null);
  };

  // Launches the Flashcard Viewer
  const startFlashcards = (material) => {
    if (material.flashcardData && material.flashcardData.length > 0) {
      setFlashcardMaterial({
        title: material.title,
        content: material.definition, // Pass content for explainer
        flashcardData: material.flashcardData,
      });
      setSelectedModule(null);
    } else {
      alert("No flashcards loaded for this submodule.");
    }
  };

  const closeFlashcardViewer = () => {
    setFlashcardMaterial(null);
  };

  // Renders the list of submodules for the currently selected module
  const SubmoduleList = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-700">
        <h3 className="text-2xl font-bold text-yellow-300">
          {selectedModule.name} - Submodules
        </h3>
        <button
          onClick={closeModuleDetails}
          className="text-lg text-gray-400 hover:text-red-400"
        >
          (Back to Modules)
        </button>
      </div>
      <p className="text-gray-300 mb-6">
        Select a topic to start your flashcards.
      </p>

      <div className="space-y-4">
        {selectedModule.submodules.map((submodule) => (
          <div
            key={submodule.id}
            className="flex items-center justify-between p-4 bg-black/40 border-2 border-gray-700 rounded transition-all hover:bg-black/80 hover:border-yellow-300 shadow-md"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                <img src={submodule.icon} alt="" srcset="" />
              </span>
              <div>
                <div className="font-bold text-lg text-white">
                  {submodule.title}
                </div>
                <div className="text-sm text-gray-300">{submodule.content}</div>
              </div>
            </div>
            <PixelButton
              variant="success"
              className="px-4 py-2"
              onClick={() => startFlashcards(submodule)}
            >
              {`🧠 START (${submodule.flashcardData.length})`}
            </PixelButton>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-300">
        📚 FLASHCARD LEARNING CENTER
      </h2>

      {/* 1. Subject Selection Area */}
      {!selectedSubject && (
        <>
          <p className="text-center text-lg text-gray-300 mb-6">
            Choose a subject to filter your learning modules.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {Object.entries(subjects).map(([key, subject]) => (
              <button
                key={key}
                onClick={() => handleSubjectSelect(key)}
                className={`dashboard-card p-4 rounded-lg border-4 border-black shadow-[4px_4px_0_#000] transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[#600000] to-[#400000]`}
              >
                <div className="text-center">
                  <img
                    src={subject.icon}
                    alt={`${subject.name} icon`}
                    className="w-12 h-12 mx-auto mb-2 filter drop-shadow-[2px_2px_0_#000]"
                  />{" "}
                  <h3 className="font-bold text-lg mb-2">{subject.name}</h3>
                  <p className="text-sm text-gray-300">{subject.description}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* 2. Module Filter/List Area */}
      {selectedSubject && !flashcardMaterial && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-2 border-b border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-3 md:mb-0">
              Modules in:{" "}
              <span className="text-yellow-300">
                {subjects[selectedSubject].name}
              </span>
            </h3>
            <div className="flex space-x-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Filter Modules by Name..."
                value={moduleFilter}
                onChange={(e) => {
                  setModuleFilter(e.target.value);
                  setSelectedModule(null);
                }}
                className="p-2 w-full text-black rounded border-2 border-black shadow-[2px_2px_0_#000] focus:outline-none focus:border-red-500"
              />
              <PixelButton
                variant="default"
                className="px-4 py-1 text-sm flex-shrink-0"
                onClick={() => setSelectedSubject(null)}
              >
                CHANGE
              </PixelButton>
            </div>
          </div>

          {/* Display Submodule List if a Module is clicked */}
          {selectedModule ? (
            <div className="max-w-4xl mx-auto dashboard-card bg-gradient-to-br from-[#600000] to-[#400000] border-4 border-black rounded-lg shadow-[8px_8px_0_#000]">
              <SubmoduleList />
            </div>
          ) : (
            // Display Filtered Module Cards
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredModules.length > 0 ? (
                filteredModules.map((module) => (
                  <div
                    key={module.id}
                    className="dashboard-card bg-gradient-to-br from-[#600000] to-[#400000] border-4 border-black p-6 rounded-lg shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#cc0000] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white border-4 border-black rounded flex items-center justify-center shadow-[3px_3px_0_#000]">
                          <img
                            src={module.gif}
                            alt={module.name}
                            className="w-12 h-12"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl mb-1">
                            {module.name}
                          </h3>
                          <span
                            className={`text-xs font-bold px-2 py-1 border-2 border-black shadow-[2px_2px_0_#000] ${
                              difficultyColors[module.difficulty]
                            }`}
                          >
                            {module.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-300">
                          ⭐ {module.xp} XP
                        </div>
                        <div className="text-sm text-gray-300">
                          {module.duration}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <PixelButton
                        variant={"primary"}
                        className="px-6 py-2 w-full"
                        onClick={() => openModuleDetails(module)}
                      >
                        VIEW {module.submodules.length} FLASHCARD SUBMODULES
                      </PixelButton>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 col-span-2">
                  No modules found for "{moduleFilter}" in{" "}
                  {subjects[selectedSubject].name}.
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* 3. Flashcard Viewer Modal */}
      {flashcardMaterial && (
        <FlashcardViewer
          material={flashcardMaterial}
          closeViewer={closeFlashcardViewer}
        />
      )}
    </div>
  );
};

export default LearnTab;
