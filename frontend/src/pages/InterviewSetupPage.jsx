import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const InterviewSetupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedJobId = searchParams.get("job");

  const [resumes, setResumes] = useState([]);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJob, setSelectedJob] = useState(preselectedJobId || "");
  const [loading, setLoading] = useState(true);
  const [setupLoading, setSetupLoading] = useState(false);
  const [error, setError] = useState(null);

  // New job description form state
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // Resume upload form state
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resumesResponse, jobsResponse] = await Promise.all([
          axios.get("/api/resume"),
          axios.get("/api/resume/job-description"),
        ]);

        setResumes(resumesResponse.data.resumes || []);
        setJobDescriptions(jobsResponse.data.job_descriptions || []);

        // If we have resumes and no selection, select the first one
        if (resumesResponse.data.resumes?.length > 0 && !selectedResume) {
          setSelectedResume(resumesResponse.data.resumes[0].id.toString());
        }

        // If we have job descriptions and no selection, select the first one
        if (
          jobsResponse.data.job_descriptions?.length > 0 &&
          !selectedJob &&
          !preselectedJobId
        ) {
          setSelectedJob(jobsResponse.data.job_descriptions[0].id.toString());
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Failed to load resumes and job descriptions. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [preselectedJobId, selectedResume, selectedJob]);

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please select a resume file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      setUploadProgress(0);
      const response = await axios.post("/api/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      // Add the new resume to the list and select it
      const newResume = {
        id: response.data.resume_id,
        original_filename: resumeFile.name,
        upload_date: new Date().toISOString(),
      };

      setResumes([newResume, ...resumes]);
      setSelectedResume(response.data.resume_id.toString());
      setShowResumeForm(false);
      setResumeFile(null);
      setUploadProgress(0);
    } catch (err) {
      console.error("Error uploading resume:", err);
      alert("Failed to upload resume. Please try again.");
    }
  };

  const handleJobDescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle || !jobDescription) {
      alert("Please fill in both job title and description");
      return;
    }

    try {
      const response = await axios.post("/api/resume/job-description", {
        title: jobTitle,
        description_text: jobDescription,
      });

      // Add the new job description to the list and select it
      const newJob = {
        id: response.data.job_description_id,
        title: jobTitle,
        description_text: jobDescription,
        created_at: new Date().toISOString(),
      };

      setJobDescriptions([newJob, ...jobDescriptions]);
      setSelectedJob(response.data.job_description_id.toString());
      setShowJobForm(false);
      setJobTitle("");
      setJobDescription("");
    } catch (err) {
      console.error("Error creating job description:", err);
      alert("Failed to create job description. Please try again.");
    }
  };

  const handleStartInterview = async () => {
    if (!selectedResume || !selectedJob) {
      alert("Please select both a resume and a job description");
      return;
    }

    setSetupLoading(true);
    try {
      // First, set up the interview
      const setupResponse = await axios.post("/api/interview/setup", {
        resume_id: parseInt(selectedResume),
        job_description_id: parseInt(selectedJob),
      });

      const interviewSessionId = setupResponse.data.interview_session_id;

      // Navigate to the interview room
      navigate(`/interview/room/${interviewSessionId}`);
    } catch (err) {
      console.error("Error setting up interview:", err);
      setError("Failed to set up interview. Please try again later.");
      setSetupLoading(false);
    }
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
            Set Up Interview
          </h1>
          <p className="text-gray-500 mt-1">
            Configure your mock interview session
          </p>
        </div>
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

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Resume Selection */}
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          variants={itemVariants}
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-primary-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              Select Resume
            </h2>
          </div>
          <div className="px-6 py-6">
            {resumes.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="resume-select"
                    className="text-sm font-medium text-gray-700"
                  >
                    Choose a resume
                  </label>
                  <select
                    id="resume-select"
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                    className="input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 transition-all duration-200"
                  >
                    <option value="">-- Select a resume --</option>
                    {resumes.map((resume) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.original_filename}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowResumeForm(true)}
                    className="text-primary-600 hover:text-primary-500 flex items-center transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Upload new resume
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 mb-4">
                  You haven't uploaded any resumes yet.
                </p>
                <button
                  type="button"
                  onClick={() => setShowResumeForm(true)}
                  className="btn btn-primary bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Upload Resume
                </button>
              </div>
            )}

            {/* Resume Upload Form */}
            {showResumeForm && (
              <motion.div
                className="mt-6 p-6 border border-gray-200 rounded-lg bg-gray-50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-900">
                    Upload New Resume
                  </h3>
                  <button
                    onClick={() => setShowResumeForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleResumeUpload} className="space-y-4">
                  <div>
                    <label
                      htmlFor="resume-file"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Select PDF file
                    </label>
                    <input
                      type="file"
                      id="resume-file"
                      accept=".pdf"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-all duration-200"
                    />
                  </div>

                  {uploadProgress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Upload
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Job Description Selection */}
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          variants={itemVariants}
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-primary-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
              Select Job Description
            </h2>
          </div>
          <div className="px-6 py-6">
            {jobDescriptions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="job-select"
                    className="text-sm font-medium text-gray-700"
                  >
                    Choose a job description
                  </label>
                  <select
                    id="job-select"
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 transition-all duration-200"
                  >
                    <option value="">-- Select a job description --</option>
                    {jobDescriptions.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowJobForm(true)}
                    className="text-primary-600 hover:text-primary-500 flex items-center transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Create new job description
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">
                  You haven't created any job descriptions yet.
                </p>
                <button
                  type="button"
                  onClick={() => setShowJobForm(true)}
                  className="btn btn-primary bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create Job Description
                </button>
              </div>
            )}

            {/* Job Description Form */}
            {showJobForm && (
              <motion.div
                className="mt-6 p-6 border border-gray-200 rounded-lg bg-gray-50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-900">
                    Create New Job Description
                  </h3>
                  <button
                    onClick={() => {
                      setShowJobForm(false);
                      setJobTitle("");
                      setJobDescription("");
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <form
                  onSubmit={handleJobDescriptionSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="job-title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="job-title"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 transition-all duration-200"
                      placeholder="e.g. Software Engineer"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="job-description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Job Description
                    </label>
                    <textarea
                      id="job-description"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      rows={6}
                      className="input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 transition-all duration-200"
                      placeholder="Paste the full job description here..."
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Create
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Start Interview Button */}
      <motion.div
        className="flex justify-center mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={handleStartInterview}
          disabled={!selectedResume || !selectedJob || setupLoading}
          className={`relative overflow-hidden group px-8 py-4 rounded-xl text-lg font-medium shadow-lg transition-all duration-300 ${
            !selectedResume || !selectedJob
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white hover:shadow-xl"
          }`}
        >
          <div className="relative flex items-center justify-center gap-3 z-10">
            {setupLoading ? (
              <>
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                <span>Setting up interview...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Start Interview</span>
              </>
            )}
          </div>
          {(!selectedResume || !selectedJob) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-0 backdrop-filter backdrop-blur-[1px]">
              <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-sm text-sm text-gray-600">
                {!selectedResume && !selectedJob
                  ? "Select a resume and job description"
                  : !selectedResume
                  ? "Select a resume"
                  : "Select a job description"}
              </div>
            </div>
          )}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-400 to-primary-300 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out -z-10"></div>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default InterviewSetupPage;
