
import { ObjectDetector, FilesetResolver } from '@mediapipe/tasks-vision';

export const initializeObjectDetector = async (modelPath, scoreThreshold, maxResults) => {
  const visionFilesetResolver = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  );
  const objectDetector = await ObjectDetector.createFromOptions(
    visionFilesetResolver, 
    {
      baseOptions: {
        modelAssetPath: modelPath,
      },
      runningMode: 'LIVE_STREAM', 
      scoreThreshold: scoreThreshold, 
      maxResults: maxResults,        
    }
  );
  
  return objectDetector; 
};