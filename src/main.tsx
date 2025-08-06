import React from "react";
import ReactDOM from "react-dom/client";
//import App from "./App.tsx";
//import App from "./App.full"; // ✅ ใช้ App.full.tsx แทน
import App from "./App.todo";
import "./index.css";

//import "@picocss/pico/css/pico.violet.min.css";
import "@picocss/pico/css/pico.lime.min.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
