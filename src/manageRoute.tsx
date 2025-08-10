import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage"; // Import LoginPage
import HomePage from "./pages/App.v3"; // The page shown after login
//import TodoPage from "./pages/TodoPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      {/* <Route path="/todo" element={<TodoPage />} /> */}
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
};

export default App;
