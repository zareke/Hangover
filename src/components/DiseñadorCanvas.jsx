import React, { useRef, useState, useEffect  } from 'react';
import BrushTool from './BrushTool';
import shirt from '../vendor/imgs/shirtpng.png';
const DiseñadorCanvas = () => {
  const canvasRef = useRef(null);
const [activeTool,setActiveTool] = useState('brush')
const [backgroundImage, setBackgroundImage] = useState(null);
const [drawingColor, setDrawingColor] = useState('#000000');
const [color, setBackColor] = useState('#FFFFFF');

const [brushSize, setBrushSize] = useState(5);

  // Cargar la imagen de fondo cuando el componente se monta
  useEffect(() => {
    const img = new Image();
    img.src = shirt; // Ruta de la imagen de fondo
    img.onload = () => {
      setBackgroundImage(img);
      // Llama a la función para dibujar el fondo
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (canvas && context) {
        context.fillStyle = color; // Usa el color de fondo actual
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height); // Dibuja la imagen de fondo
      }
    };
  }, []);
  
 
  const setBackgroundColor = (e) => {
    setBackColor(e.target.value);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (canvas && context) {
      // Dibuja el nuevo color de fondo
      context.fillStyle = e.target.value; // Usa el color seleccionado
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Redibujar la imagen de fondo
      if (backgroundImage) {
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      }
    }
  };
  
  const drawImageOnTop = (img) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (canvas && context) {
      context.drawImage(img, 0, 0, canvas.width, canvas.height); // Dibujar la imagen PNG encima
    }
  };
  const drawBackground = (img) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
      context.drawImage(img, 0, 0, canvas.width, canvas.height); // Dibujar la imagen de fondo
    }
  };
    const redrawWithBackground = (drawingFunction) => {
      drawingFunction(); // Luego dibujar lo que sea que hagas (ej. el pincel)
      if (backgroundImage) {
        drawBackground(backgroundImage); // Redibujar la imagen de fondo
      }
      
    };
    const handleBrushSizeChange = (e) => {
      setBrushSize(parseInt(e.target.value));
    };
  return (
    <div>
      
      <h1>Diseñador</h1>
      <label>
          Color:
          <input type="color" value={color} onChange={setBackgroundColor} />
          </label>
      <button class="designer-button" onClick={() => setActiveTool('brush')}>🧹</button>
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
      <canvas 
        ref={canvasRef}
        width={300}
        height={333}
        style={{ border: '1px solid black' }}
        drawImageOnCanvas
      >
        <img src={shirt} alt="Shirt" className="shirt-image" />
      </canvas>
      
      {activeTool === 'brush' && <BrushTool canvasRef={canvasRef} />}
      {<BrushTool canvasRef={canvasRef} backgroundImage={backgroundImage}   drawImageOnTop={drawImageOnTop} brushColor={drawingColor} brushSize={brushSize}></BrushTool>}
    </div>
  );
};

export default DiseñadorCanvas;
