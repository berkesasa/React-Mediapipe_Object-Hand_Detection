//cleanupMediaPipeResources.js
export const cleanupMediaPipeResources = ({ animationFrameId, videoRef, objectDetectorRef }) => {
  if (animationFrameId.current) {
    cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = null; 
    console.log("Animation frame loop stopped.");
  }

  if (videoRef.current && videoRef.current.srcObject) {
    videoRef.current.srcObject.getTracks().forEach(track => {
      track.stop(); 
      console.log(`MediaStreamTrack stopped: ${track.kind}`);
    });
    videoRef.current.srcObject = null;
  }
  if (objectDetectorRef.current) {
    objectDetectorRef.current.close();
    objectDetectorRef.current = null; 
    console.log("MediaPipe ObjectDetector closed.");
  }

};