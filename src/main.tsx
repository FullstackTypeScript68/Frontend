import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter as Router } from "react-router-dom";
import App from "./manageRoute.tsx";

//import "@picocss/pico/css/pico.violet.min.css";
import "@picocss/pico/css/pico.lime.min.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      {" "}
      {/* Wrap the application in BrowserRouter to enable routing */}
      <App /> {/* Render the App component which contains the routes */}
    </Router>
  </React.StrictMode>
);
