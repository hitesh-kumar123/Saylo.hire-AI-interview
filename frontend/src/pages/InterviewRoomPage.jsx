import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const InterviewRoomPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [livekitUrl, setLivekitUrl] = useState("");
  const [livekitToken, setLivekitToken] = useState("");
  const [status, setStatus] = useState("initializing");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const room = useRef(null);

  useEffect(() => {
    const setupInterview = async () => {
      try {
        setStatus("connecting");
        // Use axios without hardcoded URL
        const res = await axios.post(`/api/interview/start`, {
          interview_session_id: interviewId,
        });
        setLivekitUrl(res.data.livekit_url);
        setLivekitToken(res.data.livekit_token);
        setTimeout(() => setStatus("connected"), 1500); // Simulate connection for demo
      } catch (error) {
        console.error("Error starting interview:", error);
        setErrorMessage(
          "Failed to start interview: " +
            (error.response?.data?.message || error.message)
        );
        setStatus("error");
      }
    };

    setupInterview();
  }, [interviewId]);

  const handleEndInterview = () => {
    // In a real implementation, you would disconnect from LiveKit here
    // and possibly make an API call to mark the interview as completed
    navigate(`/interview/${interviewId}/results`);
  };

  const toggleMic = () => {
    setIsMicMuted(!isMicMuted);
    // In a real implementation, you would toggle the microphone here
  };

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
    // In a real implementation, you would toggle the camera here
  };

  if (status === "error") {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-red-100"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="flex items-center mb-6">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600">Error</h1>
          </div>
          <p className="text-gray-700 mb-6">{errorMessage}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Return to Dashboard
          </button>
        </motion.div>
      </motion.div>
    );
  }

  // In a real implementation, you would use LiveKit components here
  // This is a placeholder UI for the mock interview room
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Mock Interview Session
          </motion.h1>
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium text-gray-300 border border-gray-700"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {status === "initializing" && "Initializing interview..."}
            {status === "connecting" && "Connecting to interview room..."}
            {status === "connected" && "Connected to interview room"}
          </motion.div>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* User video placeholder */}
          <motion.div
            className="bg-gray-800 rounded-xl p-4 relative h-64 md:h-96 border border-gray-700 overflow-hidden shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-full h-full flex items-center justify-center">
              {isCameraOff ? (
                <div className="text-center">
                  <div className="bg-gray-700 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400">Camera is turned off</p>
                </div>
              ) : (
                <p>Your video would appear here</p>
              )}
            </div>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 backdrop-blur-sm text-xs px-3 py-1.5 rounded-lg flex items-center">
              <div
                className={`h-2 w-2 rounded-full mr-2 ${
                  isMicMuted ? "bg-red-500" : "bg-green-500"
                }`}
              ></div>
              <span>You {isMicMuted && "(Muted)"}</span>
            </div>
            {isMicMuted && (
              <div className="absolute top-4 right-4 bg-red-500 rounded-full p-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9l-9.9-9.9zM10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 112 0v2a1 1 0 11-2 0v-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </motion.div>

          {/* AI interviewer video placeholder */}
          <motion.div
            className="bg-gray-800 rounded-xl p-4 relative h-64 md:h-96 border border-gray-700 overflow-hidden shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-full h-full flex items-center justify-center">
              {status === "connected" ? (
                <div className="text-center">
                  <div className="bg-primary-900 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-4 border-2 border-primary-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-primary-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-primary-300">AI Interviewer is active</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="relative mx-auto mb-4">
                    <div className="w-24 h-24 rounded-full absolute border-4 border-solid border-gray-700"></div>
                    <div className="w-24 h-24 rounded-full animate-spin absolute border-4 border-solid border-primary-600 border-t-transparent"></div>
                  </div>
                  <p>Connecting to AI interviewer...</p>
                </div>
              )}
            </div>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 backdrop-blur-sm text-xs px-3 py-1.5 rounded-lg flex items-center">
              <div className="h-2 w-2 rounded-full mr-2 bg-blue-500"></div>
              <span>AI Interviewer</span>
            </div>
          </motion.div>
        </div>

        {/* Interview controls */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={toggleMic}
            className={`flex items-center justify-center rounded-full w-14 h-14 ${
              isMicMuted
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            } transition-colors duration-300 shadow-lg`}
          >
            {isMicMuted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M3.293 3.293a1 1 0 011.414 0L10 8.586l5.293-5.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          <button
            onClick={toggleCamera}
            className={`flex items-center justify-center rounded-full w-14 h-14 ${
              isCameraOff
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            } transition-colors duration-300 shadow-lg`}
          >
            {isCameraOff ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                <path
                  fillRule="evenodd"
                  d="M3.293 3.293a1 1 0 011.414 0L10 8.586l5.293-5.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                <path d="M14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleEndInterview}
            className="flex items-center justify-center rounded-full w-14 h-14 bg-red-600 hover:bg-red-700 transition-colors duration-300 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              <path
                fillRule="evenodd"
                d="M3.293 3.293a1 1 0 011.414 0L10 8.586l5.293-5.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </motion.div>

        {/* Status message */}
        <motion.p
          className="mt-6 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {status === "initializing" && "Initializing interview..."}
          {status === "connecting" && "Connecting to interview room..."}
          {status === "connected" && (
            <span className="flex items-center justify-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              Connected to interview room
            </span>
          )}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default InterviewRoomPage;
