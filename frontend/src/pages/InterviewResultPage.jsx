import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const InterviewResultPage = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    const fetchInterviewResult = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/interview/results/${id}`);
        setResult(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching interview result:", err);
        setError("Failed to load interview results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewResult();
  }, [id]);

  const fetchTranscript = async () => {
    if (transcript) {
      setShowTranscript(!showTranscript);
      return;
    }

    try {
      const response = await axios.get(
        `/api/interview/results/${id}/transcript`
      );
      setTranscript(response.data.transcript);
      setShowTranscript(true);
    } catch (err) {
      console.error("Error fetching interview transcript:", err);
      setError("Failed to load interview transcript. Please try again later.");
    }
  };

  const getScoreColorClass = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-yellow-500 to-amber-600";
    return "from-red-500 to-rose-600";
  };

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
          <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-primary-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md"
        role="alert"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="block sm:inline">{error}</span>
        <Link
          to="/history"
          className="block mt-4 text-red-700 font-medium flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Interview History
        </Link>
      </motion.div>
    );
  }

  if (!result) {
    return (
      <motion.div
        className="text-center py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Interview Result Not Found
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          The interview result you're looking for doesn't exist or has been
          removed.
        </p>
        <Link
          to="/history"
          className="btn btn-primary bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Back to Interview History
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex justify-between items-center"
        variants={itemVariants}
      >
        <div>
          <Link
            to="/history"
            className="text-primary-600 hover:text-primary-700 flex items-center mb-2 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to Interview History
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Interview Results
          </h1>
        </div>
        <div className="text-right bg-white rounded-lg shadow-sm px-4 py-3 border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Interview Date</div>
          <div className="font-medium">{formatDate(result.interview_date)}</div>
        </div>
      </motion.div>

      {/* Overview Card */}
      <motion.div
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
        variants={itemVariants}
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Overview</h2>
        </div>
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Job Title</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {result.job_title}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Resume</h3>
              <p className="mt-1 text-lg font-medium text-gray-900 truncate">
                {result.resume_filename}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Overall Score
              </h3>
              <div className="flex items-center mt-1">
                <div className="relative h-16 w-16 mr-3">
                  <svg className="h-16 w-16" viewBox="0 0 36 36">
                    <path
                      className="stroke-current text-gray-200"
                      fill="none"
                      strokeWidth="3"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`stroke-current ${getScoreColorClass(
                        result.score
                      )}`}
                      fill="none"
                      strokeWidth="3"
                      strokeDasharray={`${result.score}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text
                      x="18"
                      y="20.5"
                      className="text-3xl font-bold"
                      textAnchor="middle"
                      fill={
                        result.score >= 80
                          ? "#059669"
                          : result.score >= 60
                          ? "#d97706"
                          : "#dc2626"
                      }
                    >
                      {result.score}
                    </text>
                  </svg>
                </div>
                <div>
                  <p
                    className={`text-3xl font-bold ${getScoreColorClass(
                      result.score
                    )}`}
                  >
                    {result.score}/100
                  </p>
                  <p className="text-sm text-gray-500">
                    {result.score >= 80
                      ? "Excellent"
                      : result.score >= 60
                      ? "Good"
                      : "Needs Improvement"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feedback Summary */}
      <motion.div
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
        variants={itemVariants}
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
          <h2 className="text-lg font-medium text-primary-900">
            Feedback Summary
          </h2>
        </div>
        <div className="px-6 py-6">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {result.feedback_summary}
          </p>
        </div>
      </motion.div>

      {/* Strengths */}
      {result.detailed_feedback?.strengths &&
        result.detailed_feedback.strengths.length > 0 && (
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            variants={itemVariants}
          >
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
              <h2 className="text-lg font-medium text-green-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Strengths
              </h2>
            </div>
            <div className="px-6 py-6">
              <ul className="space-y-3">
                {result.detailed_feedback.strengths.map((strength, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{strength}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

      {/* Areas for Improvement */}
      {result.detailed_feedback?.areas_for_improvement &&
        result.detailed_feedback.areas_for_improvement.length > 0 && (
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            variants={itemVariants}
          >
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-yellow-100">
              <h2 className="text-lg font-medium text-yellow-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Areas for Improvement
              </h2>
            </div>
            <div className="px-6 py-6">
              <ul className="space-y-3">
                {result.detailed_feedback.areas_for_improvement.map(
                  (area, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <svg
                        className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{area}</span>
                    </motion.li>
                  )
                )}
              </ul>
            </div>
          </motion.div>
        )}

      {/* Transcript Section */}
      {result.has_transcript && (
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          variants={itemVariants}
        >
          <div
            className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 cursor-pointer"
            onClick={fetchTranscript}
          >
            <button className="text-lg font-medium text-gray-900 flex items-center focus:outline-none w-full justify-between">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Interview Transcript</span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  showTranscript ? "transform rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </div>
          {showTranscript && (
            <motion.div
              className="px-6 py-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {transcript ? (
                <div className="whitespace-pre-line text-gray-700 max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 leading-relaxed">
                  {transcript}
                </div>
              ) : (
                <div className="flex justify-center items-center h-24">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full absolute border-4 border-solid border-gray-200"></div>
                    <div className="w-8 h-8 rounded-full animate-spin absolute border-4 border-solid border-primary-600 border-t-transparent"></div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div className="flex justify-between" variants={itemVariants}>
        <Link
          to="/history"
          className="btn btn-secondary hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to History
        </Link>
        <Link
          to="/interview/setup"
          className="btn btn-primary bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
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
      </motion.div>
    </motion.div>
  );
};

export default InterviewResultPage;
