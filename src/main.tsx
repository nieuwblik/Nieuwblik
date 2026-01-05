import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { logWebVitals } from "./utils/performanceMonitor";

// Enable performance monitoring in development
if (import.meta.env.DEV) {
  logWebVitals();
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker only in production to avoid Vite dev caching issues
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // no-op: SW is an enhancement; app should work without it
    });
  });
}

