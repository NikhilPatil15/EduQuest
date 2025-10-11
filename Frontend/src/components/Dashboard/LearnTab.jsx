import React, { useState } from 'react';
import PixelButton from './PixelButton';

const LearnTab = ({ trainerData }) => {
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [selectedModule, setSelectedModule] = useState(null);

  const subjects = {
    math: {
      name: 'Mathematics',
      icon: '🧮',
      color: 'bg-blue-600',
      description: 'Master numbers, algebra, geometry, and problem-solving skills'
    },
    science: {
      name: 'Science',
      icon: '🔬',
      color: 'bg-green-600',
      description: 'Explore physics, chemistry, biology, and scientific methods'
    },
    history: {
      name: 'History',
      icon: '📜',
      color: 'bg-yellow-600',
      description: 'Discover world history, civilizations, and historical events'
    }
  };

  const learningModules = {
    math: [
      { 
        id: 'math_1',
        name: 'ALGEBRA FUNDAMENTALS', 
        difficulty: 'INTERMEDIATE', 
        xp: 200, 
        duration: '25 MIN',
        completed: false,
        type: 'MATH',
        gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
        materials: [
          { 
            type: 'video', 
            title: 'Variables and Equations', 
            duration: '8 min', 
            content: 'Learn how to solve basic algebraic equations with variables',
            topics: ['Variables', 'Equations', 'Solving for x']
          },
          { 
            type: 'interactive', 
            title: 'Equation Solver Tool', 
            duration: '10 min', 
            content: 'Practice solving equations with our interactive tool',
            topics: ['Interactive Practice', 'Step-by-step Solutions']
          },
          { 
            type: 'quiz', 
            title: 'Algebra Basics Quiz', 
            questions: 15, 
            content: 'Test your understanding of algebraic concepts',
            topics: ['Basic Operations', 'Equation Solving', 'Word Problems']
          },
          { 
            type: 'worksheet', 
            title: 'Practice Problems', 
            problems: 25, 
            content: 'Download and solve these practice problems',
            topics: ['Practice Sheets', 'Answer Keys', 'Extra Practice']
          }
        ]
      },
      { 
        id: 'math_2',
        name: 'GEOMETRY & SHAPES', 
        difficulty: 'INTERMEDIATE', 
        xp: 180, 
        duration: '30 MIN',
        completed: false,
        type: 'MATH',
        gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png',
        materials: [
          { 
            type: 'video', 
            title: 'Understanding Shapes', 
            duration: '6 min', 
            content: 'Learn about different geometric shapes and their properties',
            topics: ['2D Shapes', '3D Shapes', 'Properties']
          },
          { 
            type: 'interactive', 
            title: 'Shape Builder Game', 
            duration: '12 min', 
            content: 'Build and manipulate shapes in our interactive game',
            topics: ['Shape Construction', 'Angles', 'Measurements']
          },
          { 
            type: 'quiz', 
            title: 'Geometry Quiz', 
            questions: 12, 
            content: 'Test your knowledge of geometric concepts',
            topics: ['Shape Recognition', 'Formulas', 'Calculations']
          }
        ]
      }
    ],
    science: [
      { 
        id: 'science_1',
        name: 'CHEMISTRY BASICS', 
        difficulty: 'INTERMEDIATE', 
        xp: 220, 
        duration: '35 MIN',
        completed: false,
        type: 'SCIENCE',
        gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
        materials: [
          { 
            type: 'video', 
            title: 'Elements and Compounds', 
            duration: '9 min', 
            content: 'Understand the difference between elements and compounds',
            topics: ['Periodic Table', 'Chemical Bonds', 'Molecules']
          },
          { 
            type: 'interactive', 
            title: 'Periodic Table Explorer', 
            duration: '12 min', 
            content: 'Explore the periodic table and element properties',
            topics: ['Element Properties', 'Groups', 'Periods']
          },
          { 
            type: 'quiz', 
            title: 'Chemistry Quiz', 
            questions: 15, 
            content: 'Test your chemistry knowledge',
            topics: ['Elements', 'Compounds', 'Basic Reactions']
          },
          { 
            type: 'lab', 
            title: 'Virtual Chemistry Lab', 
            duration: '20 min', 
            content: 'Perform virtual chemistry experiments safely',
            topics: ['Lab Safety', 'Experiments', 'Observations']
          }
        ]
      },
      { 
        id: 'science_2',
        name: 'BIOLOGY & LIFE SCIENCE', 
        difficulty: 'INTERMEDIATE', 
        xp: 190, 
        duration: '28 MIN',
        completed: false,
        type: 'SCIENCE',
        gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        materials: [
          { 
            type: 'video', 
            title: 'Cells and Organisms', 
            duration: '8 min', 
            content: 'Learn about cell structure and basic biology',
            topics: ['Cell Types', 'Organelles', 'Microorganisms']
          },
          { 
            type: 'interactive', 
            title: 'Cell Structure Explorer', 
            duration: '10 min', 
            content: 'Explore the parts of a cell interactively',
            topics: ['Cell Anatomy', 'Functions', 'Processes']
          },
          { 
            type: 'quiz', 
            title: 'Biology Quiz', 
            questions: 14, 
            content: 'Test your biology knowledge',
            topics: ['Cell Biology', 'Organisms', 'Life Processes']
          }
        ]
      }
    ],
    history: [
      { 
        id: 'history_1',
        name: 'WORLD WARS', 
        difficulty: 'INTERMEDIATE', 
        xp: 240, 
        duration: '40 MIN',
        completed: false,
        type: 'HISTORY',
        gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png',
        materials: [
          { 
            type: 'video', 
            title: 'Causes and Effects', 
            duration: '10 min', 
            content: 'Understand the causes and consequences of world wars',
            topics: ['WWI Causes', 'WWII Causes', 'Global Impact']
          },
          { 
            type: 'interactive', 
            title: 'War Timeline Map', 
            duration: '15 min', 
            content: 'Explore the timeline and key events of world wars',
            topics: ['Timeline', 'Key Battles', 'Major Events']
          },
          { 
            type: 'quiz', 
            title: 'World Wars Quiz', 
            questions: 18, 
            content: 'Test your knowledge of world war history',
            topics: ['Historical Facts', 'Key Figures', 'Events']
          },
          { 
            type: 'documentary', 
            title: 'Historical Footage', 
            duration: '20 min', 
            content: 'Watch actual footage from historical archives',
            topics: ['Primary Sources', 'Historical Context', 'Analysis']
          }
        ]
      },
      { 
        id: 'history_2',
        name: 'MODERN HISTORY', 
        difficulty: 'INTERMEDIATE', 
        xp: 200, 
        duration: '32 MIN',
        completed: false,
        type: 'HISTORY',
        gif: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png',
        materials: [
          { 
            type: 'video', 
            title: '20th Century Events', 
            duration: '8 min', 
            content: 'Learn about major events of the 20th century',
            topics: ['Cold War', 'Space Race', 'Technology Revolution']
          },
          { 
            type: 'interactive', 
            title: 'Cold War Simulation', 
            duration: '12 min', 
            content: 'Experience key moments of the Cold War era',
            topics: ['Political Tensions', 'Key Events', 'Global Politics']
          },
          { 
            type: 'quiz', 
            title: 'Modern History Quiz', 
            questions: 16, 
            content: 'Test your modern history knowledge',
            topics: ['Recent History', 'Global Events', 'Cultural Shifts']
          }
        ]
      }
    ]
  };

  const difficultyColors = {
    BEGINNER: 'bg-green-600',
    INTERMEDIATE: 'bg-yellow-500 text-black',
    ADVANCED: 'bg-red-600'
  };

  const materialIcons = {
    video: '🎬',
    quiz: '📝',
    interactive: '🕹️',
    worksheet: '📄',
    lab: '⚗️',
    documentary: '🎥'
  };

  const currentModules = learningModules[selectedSubject];
  const completedCount = currentModules.filter(m => m.completed).length;
  const totalXP = currentModules.reduce((acc, m) => acc + (m.completed ? m.xp : 0), 0);

  const openModuleDetails = (module) => {
    setSelectedModule(module);
  };

  const closeModuleDetails = () => {
    setSelectedModule(null);
  };

  const startLearning = (material, moduleId) => {
    // In real app, this would navigate to the specific learning content
    console.log('Starting material:', material.title, 'from module:', moduleId);
    // You can add navigation logic here based on material type
  };

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-300">📚 LEARNING CENTER</h2>

      {/* Subject Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(subjects).map(([key, subject]) => (
          <button
            key={key}
            onClick={() => setSelectedSubject(key)}
            className={`dashboard-card p-4 rounded-lg border-4 border-black shadow-[4px_4px_0_#000] transition-all duration-300 hover:-translate-y-1 ${
              selectedSubject === key 
                ? 'bg-gradient-to-br from-[#800000] to-[#600000] shadow-[6px_6px_0_#000]' 
                : 'bg-gradient-to-br from-[#600000] to-[#400000]'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{subject.icon}</div>
              <h3 className="font-bold text-lg mb-2">{subject.name}</h3>
              <p className="text-sm text-gray-300">{subject.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Learning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentModules.map((module) => (
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
                  <h3 className="font-bold text-xl mb-1">{module.name}</h3>
                  <span className={`text-xs font-bold px-2 py-1 border-2 border-black shadow-[2px_2px_0_#000] ${difficultyColors[module.difficulty]}`}>
                    {module.difficulty}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-300">⭐ {module.xp} XP</div>
                <div className="text-sm text-gray-300">{module.duration}</div>
              </div>
            </div>

            {/* Learning Materials */}
            <div className="space-y-3 mb-4">
              <h4 className="font-bold text-yellow-300 text-lg">Learning Materials:</h4>
              {module.materials.map((material, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-black/40 border-2 border-gray-700 rounded hover:bg-black/60 cursor-pointer transition-all group"
                  onClick={() => startLearning(material, module.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {materialIcons[material.type]}
                    </span>
                    <div>
                      <div className="font-bold text-sm">{material.title}</div>
                      <div className="text-xs text-gray-300">
                        {material.duration && `Duration: ${material.duration}`}
                        {material.questions && `Questions: ${material.questions}`}
                        {material.problems && `Problems: ${material.problems}`}
                      </div>
                      <div className="text-xs text-blue-300 mt-1">
                        Topics: {material.topics.join(', ')}
                      </div>
                    </div>
                  </div>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded border-2 border-black font-bold transition-all group-hover:scale-105">
                    Start
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-300">
                {module.materials.length} learning materials
              </div>
              <PixelButton 
                variant={module.completed ? 'success' : 'primary'}
                className="px-6 py-2"
                onClick={() => openModuleDetails(module)}
              >
                {module.completed ? '✅ COMPLETED' : 'VIEW DETAILS'}
              </PixelButton>
            </div>
          </div>
        ))}
      </div>

      {/* Module Details Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#600000] to-[#400000] border-4 border-black rounded-lg shadow-[8px_8px_0_#000] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-yellow-300 mb-2">{selectedModule.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-2 py-1 border-2 border-black ${difficultyColors[selectedModule.difficulty]}`}>
                      {selectedModule.difficulty}
                    </span>
                    <span className="text-sm text-gray-300">{selectedModule.duration}</span>
                    <span className="text-sm text-yellow-300">⭐ {selectedModule.xp} XP</span>
                  </div>
                </div>
                <button
                  onClick={closeModuleDetails}
                  className="text-2xl hover:text-yellow-300 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {selectedModule.materials.map((material, index) => (
                  <div key={index} className="bg-black/40 border-2 border-gray-700 p-4 rounded">
                    <div className="flex items-start space-x-3 mb-3">
                      <span className="text-2xl">{materialIcons[material.type]}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-white">{material.title}</h4>
                        <p className="text-sm text-gray-300 mt-1">{material.content}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {material.topics.map((topic, topicIndex) => (
                            <span key={topicIndex} className="text-xs bg-blue-600 px-2 py-1 rounded border border-blue-400">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        {material.duration && `Duration: ${material.duration}`}
                        {material.questions && ` • ${material.questions} questions`}
                        {material.problems && ` • ${material.problems} problems`}
                      </span>
                      <button 
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded border-2 border-black font-bold transition-all hover:scale-105"
                        onClick={() => startLearning(material, selectedModule.id)}
                      >
                        Start Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnTab;