//detectObjectsAndDraw.js
import { drawDetections } from "./drawDetections";

export const detectObjectsAndDraw = (
  videoElement,
  canvasElement,
  objectDetector,
  setDetectionsCallback
) => {
  const context = canvasElement.getContext("2d");

  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  context.clearRect(0, 0, canvasElement.width, canvasElement.height);
  
  // Video görüntüsünü canvas'a çizmeyi kaldırdık çünkü 
  // video zaten CSS ile görünüyor ve mirror edilmiş
  // Sadece detection box'ları çizeceğiz

  try {
    const detectionsResult = objectDetector.detectForVideo(
      videoElement,
      performance.now()
    );
    setDetectionsCallback(detectionsResult.detections);
    drawDetections(
      context,
      detectionsResult.detections,
      canvasElement.width,
      canvasElement.height
    );

   
  } catch (err) {
    console.error("Error during object detection or drawing:", err);
    setDetectionsCallback([]);
    return [];
  }
};