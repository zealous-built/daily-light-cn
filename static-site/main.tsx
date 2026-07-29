import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DailyLight } from "../app/DailyLight";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DailyLight />
  </StrictMode>,
);
