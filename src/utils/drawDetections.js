// src/utils/drawDetections.js

export const drawDetections = (context, detections, canvasWidth, canvasHeight) => {
  detections.forEach(detection => {
    const bbox = detection.boundingBox;
    const category = detection.categories[0]; 
    
    // Koordinatları mirror et - video CSS ile mirror edildiği için detection box'ları da mirror etmemiz gerekiyor
    const originalX = bbox.originX;
    const mirroredX = canvasWidth - (originalX + bbox.width);
    
    // Bounding box çiz
    context.strokeStyle = 'red'; 
    context.lineWidth = 2;      
    context.strokeRect(mirroredX, bbox.originY, bbox.width, bbox.height);        
    
    // Text label çiz
    context.fillStyle = 'red';   
    context.font = '16px Arial'; 
    const text = `${category.categoryName} (${(category.score * 100).toFixed(2)}%)`;
    const textX = mirroredX;
    const textY = bbox.originY > 10 ? bbox.originY - 5 : 10;
    context.fillText(text, textX, textY);
  });
};