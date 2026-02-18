# 🎮 EduQuest: A Pokémon-Inspired Gamified Learning Adventure

[![EduQuest](https://img.shields.io/badge/EduQuest-Gamified_Learning-blue?style=for-the-badge)](https://github.com/your-username/eduquest)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**EduQuest** is a cutting-edge gamified learning platform that transforms education into an immersive adventure. Inspired by the mechanics of Pokémon, it turns studying into a quest where users battle, evolve, and conquer challenges to master new subjects.

Our mission is to make learning addictive and fun, leveraging the power of gamification, AI, and real-time interaction to boost student motivation and retention.

---

## ✨ Key Features

- **🏆 Gamified Learning Ecosystem:** An RPG-style progression system where learning earns you XP, badges, and rewards.
- **⚔️ Real-Time PvP Battles:** Challenge friends to live quiz duels powered by **Socket.io**. Speed and accuracy determine the winner!
- **🤖 AI-Powered Content:**
  - **Smart Question Generation:** Automatically generates quizzes from uploaded PDFs using AI (`pdf-parse`, `@xenova/transformers`).
  - **Adaptive Difficulty:** Algorithms that adjust challenge levels based on your performance.
- **🌍 Interactive World Map:** Explore a 3D-enhanced world built with **Three.js** and **GSAP** to unlock new chapters and challenges.
- **📊 Comprehensive Analytics:** Track your progress, strengths, and weaknesses with detailed performance insights.
- **📅 Daily Quests & Streaks:** Scheduled daily challenges powered by **node-cron** to keep your learning habit consistent.
- **📄 Document Processing:** Upload study materials (PDFs) and let our system parse and convert them into interactive study sessions.

---

## 🎥 Demo Video

Experience the adventure firsthand! Watch our gameplay demo below:


https://github.com/user-attachments/assets/4de959fc-0012-4c95-8dc9-a69abd4650d3


---

## 🛠️ Tech Stack & Methods

### Frontend (Client-Side)

- **Framework:** [React.js](https://reactjs.org/) (v19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4)
- **3D & Animation:** [Three.js](https://threejs.org/) (@react-three/fiber) & [GSAP](https://greensock.com/gsap/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State & Routing:** React Router DOM
- **Build Tool:** Vite

### Backend (Server-Side)

- **Runtime:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Language:** TypeScript
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Real-Time Engine:** [Socket.io](https://socket.io/)
- **AI & Processing:**
  - `@xenova/transformers` for AI tasks
  - `puppeteer` & `cheerio` for web scraping
  - `pdf-parse` & `pdfjs-dist` for document handling
  - `cosine-similarity` for recommendation logic
- **Scheduling:** `node-cron` for periodic tasks

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas account)
- [Git](https://git-scm.com/)

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/eduquest.git
    cd EduQuest
    ```

2.  **Backend Setup**

    Navigate to the backend directory and install dependencies:

    ```bash
    cd Backend
    npm install
    # Create a .env file based on your configuration
    cp .env.example .env
    ```

    _Configure your `.env` file with:_

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    ```

    Start the backend server:

    ```bash
    npm run dev
    ```

3.  **Frontend Setup**

    Open a new terminal, navigate to the frontend directory, and install dependencies:

    ```bash
    cd Frontend
    npm install
    ```

    Start the frontend development server:

    ```bash
    npm run dev
    ```

4.  **Access the App**

    Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 🔮 Roadmap

- [ ] **Mobile App:** React Native mobile application for learning on the go.
- [ ] **Teacher Dashboard:** Admin interface for educators to track class progress.
- [ ] **AR Mode:** Augmented Reality exploration features.
- [ ] **Voice Integration:** Voice-controlled quiz answers.

---

## 👥 The Team

**EduQuest** was brought to life by a dedicated team of developers:

|         Name          |   Role    |  ID  |
| :-------------------: | :-------: | :--: |
| **Himanshu Khairnar** | Developer | A130 |
|   **Nikhil Patil**    | Developer | A135 |
|     **Raj Patil**     | Developer | A103 |
|     **Megh Bari**     | Developer | A134 |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
