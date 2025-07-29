import React, { useState } from "react";
import ObjectDetectionApp from "./ObjectDetectionApp";
import HandDetectionApp from "./HandDetectionApp";

const TabSwitcher = () => {
  const [activeTab, setActiveTab] = useState("object"); // "object" veya "hand"

  const OBJECT_MODEL_PATH =
    "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/int8/1/efficientdet_lite0.tflite";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">MediaPipe Detection</h1>
            </div>
          </div>
          
          {/* Tab Buttons */}
          <div className="flex space-x-1 pb-3 sm:pb-4">
            <button
              onClick={() => setActiveTab("object")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === "object"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Object Detection
            </button>
            <button
              onClick={() => setActiveTab("hand")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === "hand"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Hand Detection
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === "object" && (
          <ObjectDetectionApp modelPath={OBJECT_MODEL_PATH} />
        )}
        {activeTab === "hand" && (
          <HandDetectionApp />
        )}
      </div>
    </div>
  );
};

export default TabSwitcher; 