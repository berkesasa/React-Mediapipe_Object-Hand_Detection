import React, { useEffect, useRef, useState, useCallback } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import hand_landmarker_task from "../models/hand_landmarker.task";

// MediaPipe Hand Connections
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], // thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // index
  [5, 9], [9, 10], [10, 11], [11, 12], // middle
  [9, 13], [13, 14], [14, 15], [15, 16], // ring
  [13, 17], [17, 18], [18, 19], [19, 20], // pinky
  [0, 17], // palm
];

// Drawing helpers
const drawConnectors = (ctx, landmarks, connections, options = {}) => {
  const { color = "#00FF00", lineWidth = 2 } = options;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  for (const [start, end] of connections) {
    const startPoint = landmarks[start];
    const endPoint = landmarks[end];

    if (startPoint && endPoint) {
      ctx.beginPath();
      ctx.moveTo(startPoint.x * ctx.canvas.width, startPoint.y * ctx.canvas.height);
      ctx.lineTo(endPoint.x * ctx.canvas.width, endPoint.y * ctx.canvas.height);
      ctx.stroke();
    }
  }
};

const drawLandmarks = (ctx, landmarks, options = {}) => {
  const { color = "#FF0000", radius = 4 } = options;
  ctx.fillStyle = color;

  for (const landmark of landmarks) {
    const x = landmark.x * ctx.canvas.width;
    const y = landmark.y * ctx.canvas.height;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
};

const HandDetectionApp = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const animationFrameId = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const resultsRef = useRef(undefined);

  const [handPresence, setHandPresence] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const detectHands = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const handLandmarker = handLandmarkerRef.current;

    if (!video || !canvas || !ctx || !handLandmarker) {
      animationFrameId.current = requestAnimationFrame(detectHands);
      return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      animationFrameId.current = requestAnimationFrame(detectHands);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const startTimeMs = performance.now();
    if (lastVideoTimeRef.current !== video.currentTime) {
      lastVideoTimeRef.current = video.currentTime;
      resultsRef.current = handLandmarker.detectForVideo(video, startTimeMs);
    }

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const results = resultsRef.current;
    if (results?.landmarks) {
      setHandPresence(results.handednesses.length > 0);
      for (const landmarks of results.landmarks) {
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 5 });
        drawLandmarks(ctx, landmarks, { color: "#FF0000", radius: 4 });
      }
    }

    ctx.restore();
    animationFrameId.current = requestAnimationFrame(detectHands);
  }, []);

  const initializeHandDetection = useCallback(async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: hand_landmarker_task },
        runningMode: "VIDEO",
        numHands: 2,
      });

      handLandmarkerRef.current = handLandmarker;
      setIsLoading(false);
    } catch (err) {
      console.error("HandLandmarker başlatılamadı:", err);
      setError(err);
      setIsLoading(false);
    }
  }, []);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          detectHands();
        };
      }
    } catch (err) {
      console.error("Kamera erişim hatası:", err);
      setError(err);
      setIsLoading(false);
    }
  }, [detectHands]);

  useEffect(() => {
    const init = async () => {
      await initializeHandDetection();
    };
    init();
  }, [initializeHandDetection]);

  useEffect(() => {
    if (!isLoading && !error) {
      startWebcam();
    }
  }, [isLoading, error, startWebcam]);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          El Landmark Algılama - MediaPipe
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Model yükleniyor...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 mt-6">
            Hata: {error.message || "Bilinmeyen bir hata oluştu"}
          </div>
        ) : (
          <div className="relative inline-block">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-2xl border-2 border-gray-300 rounded-lg"
              style={{ transform: "scaleX(-1)" }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HandDetectionApp;
