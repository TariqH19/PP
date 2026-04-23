import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { TrackerProvider } from "./context/TrackerContext";
import { BrowserRouter } from "react-router-dom";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TrackerProvider>
        <App />
      </TrackerProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
