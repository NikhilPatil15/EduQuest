import React from "react";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import QuizPage from "./pages/QuizPage";
import WorldPage from "./pages/WorldPage";
import Onboarding from "./pages/Onboarding";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<User />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/world" element={<WorldPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
