import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    resumes: 0,
    jobDescriptions: 0,
  });
  const [recentInterviews, setRecentInterviews] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real app, you'd make API calls to get this data
        const [historyResponse, resumesResponse, jobsResponse] =
          await Promise.all([
            axios.get("/api/interview/history"),
            axios.get("/api/resume"),
            axios.get("/api/resume/job-description"),
          ]);

        const interviews = historyResponse.data.history || [];
        const completedInterviews = interviews.filter(
          (i) => i.status === "completed"
        );
        const averageScore =
          completedInterviews.length > 0
            ? completedInterviews.reduce((sum, i) => sum + (i.score || 0), 0) /
              completedInterviews.length
            : 0;

        setStats({
          totalInterviews: interviews.length,
          completedInterviews: completedInterviews.length,
          averageScore: Math.round(averageScore),
          resumes: resumesResponse.data.resumes.length,
          jobDescriptions: jobsResponse.data.job_descriptions.length,
        });

        // Get the 3 most recent interviews
        setRecentInterviews(interviews.slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);

        // For demo purposes, set mock data if API fails
        setStats({
          totalInterviews: 8,
          completedInterviews: 5,
          averageScore: 85,
          resumes: 3,
          jobDescriptions: 4,
        });

        setRecentInterviews([
          {
            interview_id: "1",
            job_title: "Frontend Developer",
            date: new Date().toISOString(),
            status: "completed",
            has_result: true,
            score: 87,
          },
          {
            interview_id: "2",
            job_title: "UX Designer",
            date: new Date(Date.now() - 86400000).toISOString(),
            status: "completed",
            has_result: true,
            score: 92,
          },
          {
            interview_id: "3",
            job_title: "Product Manager",
            date: new Date(Date.now() - 172800000).toISOString(),
            status: "pending",
            has_result: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-600 border-r-transparent border-b-blue-400 border-l-transparent animate-spin"></div>
          <div
            className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-indigo-400 border-l-transparent animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1s" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8 pb-12"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Header with gradient background */}
      <motion.div
        variants={item}
        className="relative bg-gradient-animated rounded-xl overflow-hidden shadow-lg -mt-6 mb-8"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-8 py-12 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.first_name || "User"}!
          </h1>
          <p className="text-white/90 max-w-2xl">
            Practice your interview skills with AI-powered mock interviews.
            Track your progress and improve with each session.
          </p>
          <div className="mt-6">
            <Link
              to="/interview/setup"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Start New Interview
            </Link>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-blue-400/20 rounded-full mix-blend-overlay filter blur-2xl"></div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-blue p-6 hover-scale">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">
              Total Interviews
            </h3>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalInterviews}
          </p>
          <p className="mt-1 text-sm text-gray-500">Interviews conducted</p>
        </div>

        <div className="bg-white rounded-xl shadow-blue p-6 hover-scale">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.completedInterviews}
          </p>
          <p className="mt-1 text-sm text-gray-500">Interviews completed</p>
        </div>

        <div className="bg-white rounded-xl shadow-blue p-6 hover-scale">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="flex items-end">
            <p className="text-3xl font-bold text-gray-900">
              {stats.averageScore}
            </p>
            <span className="ml-1 text-lg text-gray-500">/100</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">Performance score</p>
        </div>

        <div className="bg-white rounded-xl shadow-blue p-6 hover-scale">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Documents</h3>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.resumes} / {stats.jobDescriptions}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Resumes / Job Descriptions
          </p>
        </div>
      </motion.div>

      {/* Recent Interviews */}
      <motion.div
        variants={item}
        className="bg-white rounded-xl shadow-blue overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Interviews
          </h3>
          {recentInterviews.length > 0 && (
            <Link
              to="/history"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center"
            >
              View all
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          )}
        </div>
        <div>
          {recentInterviews.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentInterviews.map((interview, index) => (
                <div
                  key={interview.interview_id}
                  className="px-6 py-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          interview.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {interview.status === "completed" ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          {interview.job_title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(interview.date).toLocaleDateString()} ·
                          <span
                            className={`ml-1 font-medium ${
                              interview.status === "completed"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {interview.status.charAt(0).toUpperCase() +
                              interview.status.slice(1)}
                          </span>
                          {interview.score && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Score: {interview.score}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {interview.has_result && (
                        <Link
                          to={`/interview/results/${interview.interview_id}`}
                          className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
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
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            ></path>
                          </svg>
                          Results
                        </Link>
                      )}
                      {interview.status === "pending" && (
                        <Link
                          to={`/interview/room/${interview.interview_id}`}
                          className="inline-flex items-center px-3 py-1.5 text-sm text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
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
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          Continue
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No interviews yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start your first interview to practice your skills
              </p>
              <Link
                to="/interview/setup"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Start New Interview
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Link
          to="/interview/setup"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-blue p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-white"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-1">Start New Interview</h3>
          <p className="text-white/80 text-sm">
            Practice with our AI-powered mock interviews
          </p>
        </Link>

        <Link
          to="/profile"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-blue p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-white"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-1">Manage Profile</h3>
          <p className="text-white/80 text-sm">
            Update your profile and personal information
          </p>
        </Link>

        <Link
          to="/history"
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-blue p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-white"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-1">View History</h3>
          <p className="text-white/80 text-sm">
            Check your past interviews and results
          </p>
        </Link>
      </motion.div>

      {/* Tips and Resources */}
      <motion.div
        variants={item}
        className="bg-white rounded-xl shadow-blue overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Interview Tips
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 flex">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Research the company
                </h4>
                <p className="text-sm text-gray-600">
                  Understand the company's mission, values, and recent news
                  before your interview.
                </p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 flex">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Practice the STAR method
                </h4>
                <p className="text-sm text-gray-600">
                  Structure your answers with Situation, Task, Action, and
                  Result for behavioral questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
