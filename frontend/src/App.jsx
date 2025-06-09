import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import InterviewSetupPage from "./pages/InterviewSetupPage";
import InterviewRoomPage from "./pages/InterviewRoomPage";
import InterviewHistoryPage from "./pages/InterviewHistoryPage";
import InterviewResultPage from "./pages/InterviewResultPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import LandingPage from "./pages/LandingPage";
import Layout from "./components/common/Layout";
import ScrollToTop from "./components/common/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import axios from "axios";

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";
axios.defaults.withCredentials = true; // Important for cookies/sessions

function App() {
  // Set up axios interceptors for debugging
  useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        console.log("API Request:", config.method, config.url);
        return config;
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage isLogin={true} />} />
          <Route path="/register" element={<AuthPage isLogin={false} />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/interview/setup" element={<InterviewSetupPage />} />
            <Route
              path="/interview/room/:interviewId"
              element={<InterviewRoomPage />}
            />
            <Route
              path="/interview/results/:id"
              element={<InterviewResultPage />}
            />
            <Route path="/history" element={<InterviewHistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
