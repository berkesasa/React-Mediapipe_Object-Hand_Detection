import React from "react";
import useMediaPipeObjectDetection from "../hooks/useMediaPipeObjectDetection";
import VideoCanvasDisplay from "../components/VideoCanvasDisplay";
import DetectionResults from "../components/DetectionResults";

const ObjectDetectionApp = ({ modelPath }) => {
  const { videoRef, canvasRef, detections, loading, error, startWebcam } =
    useMediaPipeObjectDetection(modelPath);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Loading State */}
      {loading && !error && (
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-base sm:text-lg font-medium">Loading MediaPipe model...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error initializing object detector</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.message || "Failed to initialize object detector."}</p>
                <p className="mt-1">Please ensure your webcam is accessible and try again.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Interface */}
      {!loading && !error && (
        <div className="space-y-4 sm:space-y-6">
          {/* Camera Controls */}
          <div className="flex justify-center">
            <button
              onClick={startWebcam}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Start Camera Detection
            </button>
          </div>

          {/* Camera Display */}
          <div className="w-full">
            <VideoCanvasDisplay
              videoRef={videoRef}
              canvasRef={canvasRef}
            />
          </div>

          {/* Detection Results */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Detection Results</h3>
              <p className="text-xs sm:text-sm text-gray-500">Objects detected in real-time</p>
            </div>
            <div className="p-4 sm:p-6">
              <DetectionResults detections={detections} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectDetectionApp;
