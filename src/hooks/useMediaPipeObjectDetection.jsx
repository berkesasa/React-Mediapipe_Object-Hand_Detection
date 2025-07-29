import { useEffect, useRef, useState, useCallback } from "react";
import { detectObjectsAndDraw } from "../utils/detectObjectsAndDraw";
import { initializeObjectDetector } from "../utils/initializeObjectDetector";
import { cleanupMediaPipeResources } from "../utils/cleanupMediaPipeResources";

const useMediaPipeObjectDetection = (
  modelPath,
  scoreThreshold = 0.5,
  maxResults = 5
) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const objectDetectorRef = useRef(null);
  const animationFrameId = useRef(null);

  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core Detection Loop Logic
  const performDetectionLoop = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !objectDetectorRef.current) {
      animationFrameId.current = requestAnimationFrame(performDetectionLoop);
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const detector = objectDetectorRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      animationFrameId.current = requestAnimationFrame(performDetectionLoop);
      return;
    }
    detectObjectsAndDraw(video, canvas, detector, setDetections);
    animationFrameId.current = requestAnimationFrame(performDetectionLoop);
  }, [setDetections]);

  //Start Webcam Function
  const startWebcam = useCallback(async () => {
    if (loading || error) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          animationFrameId.current =
            requestAnimationFrame(performDetectionLoop);
        };
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError(err);
    }
  }, [loading, error, performDetectionLoop]);

  //InitializeDetector Function

  const initializeDetector = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const detector = await initializeObjectDetector(
        modelPath,
        scoreThreshold,
        maxResults
      );
      objectDetectorRef.current = detector;
      setLoading(false);
      console.log("Object Detector initialized!");
    } catch (err) {
      console.error("Failed to initialize Object Detector:", err);
      setError(err);
      setLoading(false);
    }
  }, [modelPath, scoreThreshold, maxResults]);

  //Effects for Lifecycle Management
  useEffect(() => {
    initializeDetector();
  }, [initializeDetector]);

  useEffect(() => {
    return () => {
      cleanupMediaPipeResources({
        animationFrameId,
        videoRef,
        objectDetectorRef,
      });
    };
  }, []);
  return { videoRef, canvasRef, detections, loading, error, startWebcam };
};

export default useMediaPipeObjectDetection;
