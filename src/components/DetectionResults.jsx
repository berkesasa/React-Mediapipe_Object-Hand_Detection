// DetectionResults.jsx
import React from 'react';

const DetectionResults = ({ detections }) => {
  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getConfidenceText = (score) => {
    if (score >= 0.8) return 'High';
    if (score >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className="h-48 sm:h-64 overflow-y-auto">
      {detections.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between mb-3 sm:mb-4 sticky top-0 bg-white py-2 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Detected Objects</h3>
            <span className="text-xs sm:text-sm text-gray-500">{detections.length} object(s) found</span>
          </div>
          
          <div className="grid gap-2 sm:gap-3 pb-4">
            {detections.map((detection, index) => {
              const category = detection.categories[0];
              const confidence = category.score;
              const confidencePercentage = (confidence * 100).toFixed(1);
              
              return (
                <div 
                  key={index} 
                  className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 capitalize text-sm sm:text-base">
                          {category.categoryName.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Object #{index + 1}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium border ${getConfidenceColor(confidence)}`}>
                        {getConfidenceText(confidence)} Confidence
                      </div>
                      <div className="mt-1">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div 
                              className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${confidencePercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {confidencePercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Objects Detected</h3>
            <p className="text-xs sm:text-sm text-gray-500">Start the camera to begin object detection</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectionResults;