import React from "react";
import ObjectDetectionApp from "./components/ObjectDetectionApp";

function App() {
  const MODEL_PATH =
    "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/int8/1/efficientdet_lite0.tflite";

  return (
    <div className="App">
      <ObjectDetectionApp modelPath={MODEL_PATH} />
    </div>
  );
}

export default App;
