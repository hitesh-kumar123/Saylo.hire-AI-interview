import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const InterviewHistoryPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  useEffect(() => {
    const fetchInterviewHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/interview/history");
        setInterviews(response.data.history || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching interview history:", err);
        setError("Failed to load interview history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewHistory();
  }, []);

  // Sort interviews based on the current sort configuration
  const sortedInterviews = [...interviews].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Handle column header click for sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get the appropriate class name for the sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800";
      case "active":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800";
      case "pending":
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800";
      case "failed":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Interview History
          </h1>
          <p className="text-gray-500 mt-1">
            View and manage your past interviews
          </p>
        </div>
        <Link
          to="/interview/setup"
          className="btn btn-primary flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Start New Interview
        </Link>
      </div>

      {error && (
        <motion.div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm"
          role="alert"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="block sm:inline">{error}</span>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
            <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-primary-600 border-t-transparent"></div>
          </div>
        </div>
      ) : (
        <>
          {interviews.length === 0 ? (
            <motion.div
              className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mx-auto w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-primary-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No interviews yet
              </h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                You haven't completed any interviews yet. Start your first
                interview to practice and improve your skills.
              </p>
              <Link
                to="/interview/setup"
                className="btn btn-primary bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Start Your First Interview
              </Link>
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => requestSort("job_title")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Job Title</span>
                          <span className="text-primary-500">
                            {getSortIndicator("job_title")}
                          </span>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => requestSort("date")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Date</span>
                          <span className="text-primary-500">
                            {getSortIndicator("date")}
                          </span>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => requestSort("status")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Status</span>
                          <span className="text-primary-500">
                            {getSortIndicator("status")}
                          </span>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => requestSort("score")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Score</span>
                          <span className="text-primary-500">
                            {getSortIndicator("score")}
                          </span>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedInterviews.map((interview) => (
                      <motion.tr
                        key={interview.interview_id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                        variants={itemVariants}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {interview.job_title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(interview.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${getStatusBadgeClass(
                              interview.status
                            )}`}
                          >
                            {interview.status.charAt(0).toUpperCase() +
                              interview.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {interview.score !== null &&
                          interview.status === "completed" ? (
                            <div className="text-sm font-medium">
                              <span
                                className={`${
                                  interview.score >= 80
                                    ? "text-green-600"
                                    : interview.score >= 60
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {interview.score}/100
                              </span>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">N/A</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            {interview.has_result && (
                              <Link
                                to={`/interview/results/${interview.interview_id}`}
                                className="text-primary-600 hover:text-primary-900 transition-colors duration-200 flex items-center"
                              >
                                <span>View Results</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 ml-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </Link>
                            )}
                            {interview.status === "pending" && (
                              <Link
                                to={`/interview/room/${interview.interview_id}`}
                                className="text-primary-600 hover:text-primary-900 transition-colors duration-200 flex items-center"
                              >
                                <span>Continue</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 ml-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </Link>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default InterviewHistoryPage;
