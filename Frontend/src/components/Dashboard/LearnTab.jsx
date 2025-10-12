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
        "Master numbers, algebra, geometry, and problem-solving skills.",
    },
    science: {
      name: "Science",
      icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png", // Bulbasaur
      description:
        "Explore physics, chemistry, biology, and scientific methods.",
    },
    coding: {
        name: "Coding",
        icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/137.png", // Porygon
        description:
          "Learn programming logic, web development, and algorithms.",
    },
  };

  // Data structure with expanded dummy data
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
            {
            id: "math_1_terms",
            title: "Key Terminology",
            content: "Drill the core vocabulary for solving algebraic equations.",
            icon: "🏷️",
            flashcardData: [
                { term: "What is a **Variable**?", definition: "A symbol (e.g., x, y) representing a quantity that can change." },
                { term: "What is a **Coefficient**?", definition: "The numerical factor multiplied by a variable (e.g., the '5' in 5x)." },
                { term: "What is an **Equation**?", definition: "A statement that two expressions are equal, indicated by an equal sign (=)." },
                { term: "What is an **Expression**?", definition: "A combination of numbers, variables, and operators with NO equal sign." },
                { term: "FINAL CARD: Core Principle", definition: "The key to solving equations is to perform the **same operation on both sides** to maintain balance.", type: "imp_topic" },
            ],
            },
        ],
        },
        {
        id: "math_13",
        name: "STATISTICS",
        difficulty: "ADVANCED",
        xp: 300,
        duration: "45 MIN",
        gif: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
        submodules: [
            {
            id: "math_13_mean",
            title: "Measures of Central Tendency",
            content: "Learn to calculate mean, median, and mode.",
            icon: "📊",
            flashcardData: [
                { term: "What is the **Mean**?", definition: "The **average** of a set of numbers. Calculated by summing the values and dividing by the count of values." },
                { term: "What is the **Median**?", definition: "The **middle value** in a sorted list of numbers. It is resistant to outliers." },
                { term: "What is the **Mode**?", definition: "The value that appears **most frequently** in a data set." },
                { term: "Empirical Relationship", definition: "A useful approximation: **3 Median ≈ Mode + 2 Mean**." },
                { term: "FINAL CARD: Key Insight", definition: "The **median** is often a better measure of central tendency than the mean for skewed data because it is not affected by extreme outliers.", type: "imp_topic" },
            ],
            },
        ],
        },
        {
        id: "math_15",
        name: "GEOMETRY BASICS",
        difficulty: "BEGINNER",
        xp: 150,
        duration: "20 MIN",
        gif: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png", // Geodude
        submodules: [
            {
            id: "math_15_area",
            title: "Area & Perimeter",
            content: "Learn the foundational formulas for common shapes.",
            icon: "📏",
            flashcardData: [
                { term: "Perimeter of a **Rectangle**?", definition: "Formula: **P = 2(length + width)**. It's the total distance around the outside." },
                { term: "Area of a **Rectangle**?", definition: "Formula: **A = length × width**. It's the total space inside the shape." },
                { term: "Area of a **Triangle**?", definition: "Formula: **A = (1/2) × base × height**. Half the area of a rectangle with the same base and height." },
                { term: "Circumference of a **Circle**?", definition: "Formula: **C = 2πr**, where 'r' is the radius. It is the 'perimeter' of a circle." },
                { term: "FINAL CARD: Key Difference", definition: "**Perimeter** is a one-dimensional measurement (length), while **Area** is a two-dimensional measurement (space).", type: "imp_topic" },
            ],
            },
        ],
        },
    ],
    science: [
        {
            id: "science_1",
            name: "PHYSICS: NEWTON'S LAWS",
            difficulty: "INTERMEDIATE",
            xp: 250,
            duration: "30 MIN",
            gif: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png", // Machamp
            submodules: [
                {
                    id: "science_1_laws",
                    title: "The Three Laws of Motion",
                    content: "Understand the fundamental principles governing motion.",
                    icon: "🍎",
                    flashcardData: [
                        { term: "What is the **First Law**?", definition: "An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force. This is the law of **Inertia**." },
                        { term: "What is the **Second Law**?", definition: "The acceleration of an object is directly proportional to the net force and inversely proportional to its mass. Formula: **F = ma**." },
                        { term: "What is the **Third Law**?", definition: "For every action, there is an equal and opposite reaction." },
                        { term: "FINAL CARD: Core Concept", definition: "Newton's laws connect **force, mass, and motion**, forming the foundation of classical mechanics.", type: "imp_topic" },
                    ],
                },
            ],
        },
        {
            id: "science_2",
            name: "BIOLOGY: THE CELL",
            difficulty: "BEGINNER",
            xp: 180,
            duration: "20 MIN",
            gif: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/579.png", // Reuniclus
            submodules: [
                {
                    id: "science_2_organelles",
                    title: "Key Cell Organelles",
                    content: "Learn the functions of the main parts of a eukaryotic cell.",
                    icon: "🔬",
                    flashcardData: [
                        { term: "What is the **Nucleus**?", definition: "The 'brain' of the cell. It contains the cell's genetic material (DNA) and controls its activities." },
                        { term: "What is the **Mitochondrion**?", definition: "The 'powerhouse' of the cell. It generates most of the cell's supply of adenosine triphosphate (ATP)." },
                        { term: "What is the **Ribosome**?", definition: "Responsible for protein synthesis. They link amino acids together in the order specified by messenger RNA." },
                        { term: "What is the **Cell Membrane**?", definition: "The semipermeable membrane surrounding the cytoplasm of a cell, controlling what enters and leaves." },
                        { term: "FINAL CARD: Key Distinction", definition: "**Eukaryotic** cells have a nucleus and other membrane-bound organelles, while **Prokaryotic** cells (like bacteria) do not.", type: "imp_topic" },
                    ],
                },
            ],
        },
    ],
    coding: [
        {
            id: "coding_1",
            name: "WEB DEV: HTML & CSS",
            difficulty: "BEGINNER",
            xp: 150,
            duration: "20 MIN",
            gif: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/137.png", // Porygon
            submodules: [
                {
                    id: "coding_1_basics",
                    title: "Core Concepts",
                    content: "Understand the building blocks of all websites.",
                    icon: "🖥️",
                    flashcardData: [
                        { term: "What is **HTML**?", definition: "HyperText Markup Language. It provides the **structure** and content of a web page (headings, paragraphs, images)." },
                        { term: "What is **CSS**?", definition: "Cascading Style Sheets. It provides the **style** and presentation of a web page (colors, fonts, layout)." },
                        { term: "What is the **Box Model**?", definition: "A core CSS concept describing how every element is a rectangular box with: Content, Padding, Border, and Margin." },
                        { term: "FINAL CARD: Separation of Concerns", definition: "The best practice is to keep **HTML (structure)** and **CSS (style)** in separate files to make code cleaner and easier to maintain.", type: "imp_topic" },
                    ],
                },
            ],
        },
        {
            id: "coding_2",
            name: "JAVASCRIPT FUNDAMENTALS",
            difficulty: "INTERMEDIATE",
            xp: 220,
            duration: "35 MIN",
            gif: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/233.png", // Porygon2
            submodules: [
                {
                    id: "coding_2_vars",
                    title: "Variables & Data Types",
                    content: "Learn how to store and manage data in JavaScript.",
                    icon: "📜",
                    flashcardData: [
                        { term: "`var`, `let`, or `const`?", definition: "`const` is for variables that won't be reassigned. `let` is for variables that will be reassigned. Avoid using `var`." },
                        { term: "What is a **String**?", definition: "A data type used to represent text, enclosed in quotes (e.g., 'hello world')." },
                        { term: "What is a **Number**?", definition: "A data type for numeric values, including integers and decimals (e.g., 42, 3.14)." },
                        { term: "What is a **Boolean**?", definition: "A data type with only two possible values: **true** or **false**." },
                        { term: "FINAL CARD: Best Practice", definition: "Declare variables with **`const` by default** and only switch to `let` when you know you need to reassign the value. This prevents accidental changes.", type: "imp_topic" },
                    ],
                },
            ],
        },
    ]
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
