import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { user, loading, refreshToken } = useAuth();
  const location = useLocation();
  const getToken = localStorage.getItem("access_token");
  console.log(getToken);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full absolute border-4 border-solid border-gray-200"></div>
            <div className="w-16 h-16 rounded-full animate-spin absolute border-4 border-solid border-primary-600 border-t-transparent"></div>
          </div>
          <motion.p
            className="mt-6 text-gray-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!getToken) {
    // Save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
