import React from "react";

const VideoCanvasDisplay = ({ videoRef, canvasRef }) => {
  return (
    <div className="relative w-full max-w-3xl mx-auto border border-gray-200 shadow-lg rounded-lg overflow-hidden bg-gray-900">
      {/* Responsive aspect ratio container */}
      <div className="relative w-full">
        {/* Mobile: 9:16 aspect ratio, Desktop: 16:9 aspect ratio */}
        <div 
          className="relative w-full video-container max-h-[500px] sm:max-h-96"
          style={{ 
            aspectRatio: '16/9'
          }}
        >
          <video
            ref={videoRef}
            className="block w-full h-full object-contain scale-x-[-1]"
            autoPlay
            muted
            playsInline
          ></video>
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full object-contain"
          ></canvas>
          
          {/* Kamera durumu göstergesi */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCanvasDisplay;