import React, { useRef, useState, useEffect } from 'react';
import BrushTool from './BrushTool';
import shirt from '../vendor/imgs/shirtpng.png';
import './DiseñadorCanvas.css'

const DiseñadorCanvas = () => {
  const canvasRef = useRef(null);
  const [activeTool, setActiveTool] = useState('brush');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [color, setBackColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(5);
  const [drawings, setDrawings] = useState([]);

  useEffect(() => {
    const img = new Image();
    img.src = shirt; 
    img.onload = () => {
      setBackgroundImage(img);
      drawBackground(img);
    };
  }, []);

  const setBackgroundColor = (e) => {
    setBackColor(e.target.value);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (canvas && context) {
      context.fillStyle = e.target.value;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      if (backgroundImage) {
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      }

      redrawDrawings(context);
    }
  };

  const drawImageOnTop = (img) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (canvas && context) {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };

  const drawBackground = (img) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = true;
    
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };

  const redrawDrawings = (context) => {
    drawings.forEach(({ x, y, color, size }, index) => {
      context.strokeStyle = color;
      context.lineWidth = size;

      if (index === 0) {
        context.beginPath();
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
        context.stroke();
      }
    });
  };

  const handleBrushSizeChange = (e) => {
    setBrushSize(parseInt(e.target.value));
  };

  const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
    };
  };

  return (
    <div>
      <h1>Diseñador</h1>
      <label>
        Color:
        <input type="color" value={color} onChange={setBackgroundColor} />
      </label>
      <button className="designer-button" onClick={() => setActiveTool('brush')}>🧹</button>
      <label>
        Brush Size:
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={handleBrushSizeChange}
        />
        {brushSize}px
      </label>
      <label>
        Drawing Color:
        <input type="color" value={drawingColor} onChange={(e) => setDrawingColor(e.target.value)} />
      </label>
      <div className="canvasClass">
        <canvas 
          ref={canvasRef}
          width={1920}
          height={1080}
          style={{ 
            border: '1px solid black',
            width: '300px',
            height: '333px'
          }}
        ></canvas>
      </div>
      {activeTool === 'brush' && (
        <BrushTool 
          canvasRef={canvasRef} 
          backgroundImage={backgroundImage}
          drawImageOnTop={drawImageOnTop} 
          brushColor={drawingColor} 
          brushSize={brushSize} 
          setDrawings={setDrawings}
          getMousePos={getMousePos}
        />
      )}
    </div>
  );
};

export default DiseñadorCanvas;