// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/global.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
