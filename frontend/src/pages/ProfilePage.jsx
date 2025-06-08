import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch resumes and job descriptions in parallel
        const [resumesResponse, jobsResponse] = await Promise.all([
          axios.get("/api/resume"),
          axios.get("/api/resume/job-description"),
        ]);

        setResumes(resumesResponse.data.resumes || []);
        setJobDescriptions(jobsResponse.data.job_descriptions || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");

        // Mock data for demo purposes
        setResumes([
          {
            id: 1,
            original_filename: "John_Doe_Resume.pdf",
            upload_date: new Date().toISOString(),
            extracted_job_title: "Software Engineer",
          },
          {
            id: 2,
            original_filename: "John_Doe_Resume_2023.pdf",
            upload_date: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            extracted_job_title: "Frontend Developer",
          },
        ]);

        setJobDescriptions([
          {
            id: 1,
            title: "Senior Frontend Developer",
            created_at: new Date().toISOString(),
            description_text:
              "We are looking for an experienced Frontend Developer with expertise in React, TypeScript, and modern CSS frameworks. The ideal candidate will have 3+ years of experience building responsive web applications.",
          },
          {
            id: 2,
            title: "UX Designer",
            created_at: new Date(
              Date.now() - 15 * 24 * 60 * 60 * 1000
            ).toISOString(),
            description_text:
              "We are seeking a talented UX Designer to create amazing user experiences. The ideal candidate should have a portfolio of professional design projects and experience with Figma and Adobe Creative Suite.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      await axios.delete(`/api/resume/${resumeId}`);
      setResumes(resumes.filter((resume) => resume.id !== resumeId));
    } catch (err) {
      console.error("Error deleting resume:", err);
      alert("Failed to delete resume. Please try again.");
    }
  };

  const handleDeleteJobDescription = async (jobId) => {
    if (
      !window.confirm("Are you sure you want to delete this job description?")
    )
      return;

    try {
      await axios.delete(`/api/resume/job-description/${jobId}`);
      setJobDescriptions(jobDescriptions.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error("Error deleting job description:", err);
      alert("Failed to delete job description. Please try again.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
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
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </motion.div>

      {error && (
        <motion.div
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div variants={itemVariants} className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("resumes")}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200 ${
              activeTab === "resumes"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Resumes
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeTab === "resumes"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {resumes.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200 ${
              activeTab === "jobs"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Job Descriptions
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeTab === "jobs"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {jobDescriptions.length}
            </span>
          </button>
        </nav>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        className="mt-6"
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-xl shadow-blue overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                User Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Personal details and account settings
              </p>
            </div>
            <div>
              <div className="px-6 py-6 flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.first_name?.[0] || ""}
                  {user?.last_name?.[0] || ""}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </h4>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="border-t border-gray-100">
                <dl>
                  <div className="px-6 py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Full name
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {user?.first_name} {user?.last_name}
                    </dd>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Email address
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {user?.email}
                    </dd>
                  </div>
                  <div className="px-6 py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Account created
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {formatDate(user?.created_at)}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resumes Tab */}
        {activeTab === "resumes" && (
          <div className="bg-white rounded-xl shadow-blue overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Resumes
              </h3>
              <Link
                to="/interview/setup"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                Upload New Resume
              </Link>
            </div>
            <div>
              {resumes.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {resumes.map((resume) => (
                    <li
                      key={resume.id}
                      className="px-6 py-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <svg
                              className="w-6 h-6"
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
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {resume.original_filename}
                            </h4>
                            <p className="text-xs text-gray-500">
                              Uploaded: {formatDate(resume.upload_date)}
                            </p>
                            {resume.extracted_job_title && (
                              <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {resume.extracted_job_title}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <a
                            href={`/api/resume/${resume.id}/download`}
                            className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
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
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              ></path>
                            </svg>
                            Download
                          </a>
                          <button
                            onClick={() => handleDeleteResume(resume.id)}
                            className="inline-flex items-center px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              ></path>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 text-center">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No resumes yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Upload your resume to start practicing interviews
                  </p>
                  <Link
                    to="/interview/setup"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
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
                    Upload Resume
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Job Descriptions Tab */}
        {activeTab === "jobs" && (
          <div className="bg-white rounded-xl shadow-blue overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Job Descriptions
              </h3>
              <Link
                to="/interview/setup"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                Add New Job
              </Link>
            </div>
            <div>
              {jobDescriptions.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {jobDescriptions.map((job) => (
                    <li
                      key={job.id}
                      className="px-6 py-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              ></path>
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {job.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              Created: {formatDate(job.created_at)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-lg">
                              {job.description_text.substring(0, 100)}...
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/interview/setup?job=${job.id}`}
                            className="inline-flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
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
                            Use
                          </Link>
                          <button
                            onClick={() => handleDeleteJobDescription(job.id)}
                            className="inline-flex items-center px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              ></path>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No job descriptions yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add a job description to start practicing interviews
                  </p>
                  <Link
                    to="/interview/setup"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
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
                    Add Job Description
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;
