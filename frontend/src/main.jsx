import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import App from "./App.jsx";
import "./index.css";

// Configure axios
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.timeout = 15000; // 15 seconds timeout
axios.defaults.headers.common["Content-Type"] = "application/json";

// Disable withCredentials as we're using Bearer token auth
// withCredentials would send cookies which conflicts with JWT token auth
axios.defaults.withCredentials = false;

// Set auth token from localStorage if available
const token = localStorage.getItem("access_token");
if (token) {
  console.log("Setting authorization header at startup");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
