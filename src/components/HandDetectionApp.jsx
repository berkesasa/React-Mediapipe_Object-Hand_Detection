import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import hand_landmarker_task from "../models/hand_landmarker.task";

// MediaPipe Hand Connections
const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4], // thumb
    [0, 5], [5, 6], [6, 7], [7, 8], // index finger
    [5, 9], [9, 10], [10, 11], [11, 12], // middle finger
    [9, 13], [13, 14], [14, 15], [15, 16], // ring finger
    [13, 17], [17, 18], [18, 19], [19, 20], // pinky
    [0, 17], // palm
];

// Drawing functions from MediaPipe
const drawConnectors = (ctx, landmarks, connections, options = {}) => {
    const { color = '#00FF00', lineWidth = 2 } = options;

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
    const { color = '#FF0000', lineWidth = 1, radius = 4 } = options;

    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

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
    const [handPresence, setHandPresence] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const lastVideoTimeRef = useRef(-1);
    const resultsRef = useRef(undefined);

    useEffect(() => {
        let handLandmarker;
        let animationFrameId;

        const initializeHandDetection = async () => {
            try {
                console.log("HandLandmarker başlatılıyor...");
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
                );
                handLandmarker = await HandLandmarker.createFromOptions(
                    vision, {
                    baseOptions: { modelAssetPath: hand_landmarker_task },
                    numHands: 2,
                    runningMode: "VIDEO"
                }
                );
                console.log("HandLandmarker başarıyla yüklendi");
                setIsLoading(false);
                detectHands();
            } catch (error) {
                console.error("HandLandmarker başlatma hatası:", error);
                setIsLoading(false);
            }
        };



        const detectHands = async () => {
            if (videoRef.current && videoRef.current.readyState >= 2 && handLandmarker) {
                try {
                    const video = videoRef.current;
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');

                    // Set canvas dimensions like original code
                    canvas.style.width = video.videoWidth + 'px';
                    canvas.style.height = video.videoHeight + 'px';
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    // Now let's start detecting the stream.
                    if (handLandmarker.runningMode === "IMAGE") {
                        await handLandmarker.setOptions({ runningMode: "VIDEO" });
                    }

                    let startTimeMs = performance.now();
                    if (lastVideoTimeRef.current !== video.currentTime) {
                        lastVideoTimeRef.current = video.currentTime;
                        resultsRef.current = handLandmarker.detectForVideo(video, startTimeMs);
                    }

                    setHandPresence(resultsRef.current?.handednesses?.length > 0);

                    ctx.save();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    if (resultsRef.current?.landmarks) {
                        for (const landmarks of resultsRef.current.landmarks) {
                            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                                color: "#00FF00",
                                lineWidth: 5
                            });
                            drawLandmarks(ctx, landmarks, { color: "#FF0000", lineWidth: 2 });
                        }
                    }
                    ctx.restore();
                } catch (error) {
                    console.error("El algılama hatası:", error);
                }
            }
            animationFrameId = requestAnimationFrame(detectHands);
        };

        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 }
                    }
                });
                videoRef.current.srcObject = stream;
                await initializeHandDetection();
            } catch (error) {
                console.error("Webcam erişim hatası:", error);
                setIsLoading(false);
            }
        };

        startWebcam();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            if (handLandmarker) {
                handLandmarker.close();
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
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
                        <span className="ml-3 text-gray-600">HandLandmarker yükleniyor...</span>
                    </div>
                ) : (
                    <>
                        <div className="relative inline-block">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full max-w-2xl border-2 border-gray-300 rounded-lg"
                                style={{ transform: 'scaleX(-1)' }}
                            />
                            <canvas
                                ref={canvasRef}
                                className="absolute top-0 left-0 w-full h-full"
                                style={{ transform: 'scaleX(-1)' }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HandDetectionApp;