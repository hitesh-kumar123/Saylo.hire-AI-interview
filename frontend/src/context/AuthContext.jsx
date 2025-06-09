import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize axios headers from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // Improved refreshToken function to update user data
  const refreshToken = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) return false;

    try {
      console.log("Attempting to refresh token...");

      const response = await axios.post(
        "/api/auth/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${refresh_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Refresh successful:", response.data);
      const { access_token, user: userData } = response.data;

      // Update token in localStorage
      localStorage.setItem("access_token", access_token);

      // Update authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      // Update user data if available
      if (userData) {
        setUser(userData);
      }

      return true;
    } catch (err) {
      console.error("Token refresh failed:", err);
      console.error("Error response:", err.response?.data);

      // Only clear tokens on refresh failure, don't log out automatically
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      delete axios.defaults.headers.common["Authorization"];
      return false;
    }
  };

  // Check authentication status on mount and when tokens change
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          // No token found, try refresh token
          const refreshed = await refreshToken();
          if (!refreshed) {
            // If refresh failed, we're not logged in
            setUser(null);
          }
          setLoading(false);
          return;
        }

        // Set auth header with token
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Try to get user data
        const response = await axios.get("/api/auth/me");
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Auth check failed:", err);

        // Try to refresh the token
        const refreshed = await refreshToken();
        if (!refreshed) {
          // If refresh fails, clear user data
          setUser(null);
        }

        setLoading(false);
      }
    };

    // Check auth on mount
    checkAuth();

    // Set up storage event listener to handle logout in other tabs
    const handleStorageChange = (e) => {
      if (e.key === "access_token" && !e.newValue) {
        // Token was removed in another tab
        setUser(null);
      } else if (e.key === "access_token" && e.newValue) {
        // Token was added in another tab
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // alert("ok");
      const response = await axios.post("/api/auth/login", { email, password });
      const { access_token, refresh_token, user } = response.data;
      console.log(access_token);
      // Store tokens  in localStorage
      localStorage.setItem("access_token", access_token);
      // localStorage.setItem("refresh_token", refresh_token);

      // Set axios default headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      // Update user state
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/auth/register", userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Try to call logout API if it exists (but don't wait for it)
    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .post(
          "/api/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch(() => {
          // Ignore errors from logout endpoint
        });
    }

    // Clear local storage and state
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // Axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Try to refresh the token
          const refreshed = await refreshToken();
          if (refreshed) {
            // Retry the original request
            return axios(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
