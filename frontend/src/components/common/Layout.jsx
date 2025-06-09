import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import BackToTopButton from "./BackToTopButton";

const Layout = () => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Detect scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    success("Successfully logged out");

    // Use navigate instead of direct window location change
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-primary-700 text-white font-medium shadow-sm"
        : "text-gray-200 hover:bg-primary-600/50 hover:text-white"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header/Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-primary-800/95 backdrop-blur-sm shadow-md"
            : "bg-primary-800"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <motion.h1
                className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                Saylo.hire
              </motion.h1>
            </div>

            <nav className="hidden md:flex space-x-2 items-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <NavLink to="/interview/setup" className={navLinkClass}>
                  New Interview
                </NavLink>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <NavLink to="/history" className={navLinkClass}>
                  History
                </NavLink>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="ml-4 px-3 py-2 rounded-lg text-gray-200 hover:bg-red-600 hover:text-white transition-all duration-200 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </motion.div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                className="text-gray-200 hover:text-white p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden bg-primary-700 shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-3 space-y-1">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg ${
                      isActive
                        ? "bg-primary-800 text-white"
                        : "text-gray-200 hover:bg-primary-600 hover:text-white"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/interview/setup"
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg ${
                      isActive
                        ? "bg-primary-800 text-white"
                        : "text-gray-200 hover:bg-primary-600 hover:text-white"
                    }`
                  }
                >
                  New Interview
                </NavLink>
                <NavLink
                  to="/history"
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg ${
                      isActive
                        ? "bg-primary-800 text-white"
                        : "text-gray-200 hover:bg-primary-600 hover:text-white"
                    }`
                  }
                >
                  History
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg ${
                      isActive
                        ? "bg-primary-800 text-white"
                        : "text-gray-200 hover:bg-primary-600 hover:text-white"
                    }`
                  }
                >
                  Profile
                </NavLink>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-gray-200 hover:bg-red-600 hover:text-white flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} Saylo.hire - AI-Powered Mock
                Interviews
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-primary-600 transition-colors"
              >
                <span className="sr-only">Privacy Policy</span>
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-primary-600 transition-colors"
              >
                <span className="sr-only">Terms of Service</span>
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-primary-600 transition-colors"
              >
                <span className="sr-only">Contact</span>
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Confirm Logout
              </h3>
              <p className="text-gray-600 mb-5">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to top button */}
      <BackToTopButton />
    </div>
  );
};

export default Layout;
