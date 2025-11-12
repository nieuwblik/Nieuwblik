import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { logWebVitals } from "./utils/performanceMonitor";

// Enable performance monitoring in development
if (import.meta.env.DEV) {
  logWebVitals();
}

createRoot(document.getElementById("root")!).render(<App />);
