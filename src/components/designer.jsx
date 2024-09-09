import React, { useContext, useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import './designer.css';
import shirt from '../vendor/imgs/shirtpng.png';
import html2canvas from 'html2canvas';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import config from '../config';

const Designer = ({id: id}) => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const shirtRef = useRef(null);
  const [color, setColor] = useState('rgb(255,255,255)');
  const [pattern, setPattern] = useState('none');
  const [texts, setTexts] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [images, setImage] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingCoords, setDrawingCoords] = useState({ x: 0, y: 0 });
  const [drawingLines, setDrawingLines] = useState([]);
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const inputFile = useRef(null);

  if(id !== undefined){
    shirt = getShirt();
  }

    const getShirt = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${config.url}/design/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        return response.data.image;
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

  const handleColorChange = (e) => setColor(e.target.value);
  const handlePatternChange = (e) => setPattern(e.target.value);
  const handlePatternColorChange = (e) => document.documentElement.style.setProperty('--pattern-color', e.target.value);

  const addTextInput = () => {
    setTexts([...texts, { id: Date.now(), text: '', x: 50, y: 50, width: 100, height: 50, fontSize: '16px', fontFamily: 'Arial' }]);
  };

  const removeTextInput = (id) => {
    setTexts(texts.filter((text) => text.id !== id));
  };

  const handleTextChange = (id, newText) => {
    setTexts(texts.map((text) => (text.id === id ? { ...text, text: newText } : text)));
  };

  const handleTextDragStop = (id, x, y) => {
    setTexts(texts.map((text) => (text.id === id ? { ...text, x, y } : text)));
  };

  const handleTextResizeStop = (id, width, height) => {
    const newFontSize = Math.min(width, height) / 5; // Adjust as needed
    setTexts(texts.map((text) => (text.id === id ? { ...text, width, height, fontSize: `${newFontSize}px` } : text)));
  };

  const handleFontColorChange = (id, color) => {
    setTexts(texts.map((text) => (text.id === id ? { ...text, color } : text)));
  };

  const handleFontSizeChange = (id, fontSize) => {
    const newFontSize = parseInt(fontSize, 10);
    if (newFontSize > 100) {
      fontSize = "60px";
    } else {
      fontSize = `${newFontSize}px`;
    }
  
    setTexts(texts.map((text) => (text.id === id ? { ...text, fontSize } : text)));
  };

  const handleFontFamilyChange = (id, family) => {
    setTexts(texts.map((text) => (text.id === id ? { ...text, fontFamily: family } : text)));
  };

  const addShape = () => {
    setShapes([...shapes, { id: Date.now(), shape: 'square', x: 50, y: 50, width: 50, height: 50 }]);
  };

  const addImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(`File name: ${file.name}`);
      setImage([...images, { src: reader.result, name: file.name }]);
    };
    reader.readAsDataURL(file);
  };

  const removeShape = (id) => {
    setShapes(shapes.filter((shape) => shape.id !== id));
  };

  const handleShapeChange = (id, newShape) => {
    setShapes(shapes.map((shape) => (shape.id === id ? { ...shape, shape: newShape } : shape)));
  };

  const handleShapeDragStop = (id, x, y) => {
    setShapes(shapes.map((shape) => (shape.id === id ? { ...shape, x, y } : shape)));
  };

  const handleShapeResizeStop = (id, width1, height1) => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) => (shape.id === id ? { ...shape, width: width1, height: height1 } : shape))
    );
  };

  const handleDrawStart = (event) => {
    setIsDrawing(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setDrawingCoords({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };
  
  const handleDrawMove = (event) => {
    if (isDrawing) {
      const rect = event.currentTarget.getBoundingClientRect();
      setDrawingCoords({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      setDrawingLines([
        ...drawingLines,
        { x1: drawingCoords.x, y1: drawingCoords.y, x2: event.clientX - rect.left, y2: event.clientY - rect.top, color: drawingColor, width: brushSize },
      ]);
    }
  };

  const handleDrawEnd = () => {
    setIsDrawing(false);
  };

  const handleBrushSizeChange = (e) => {
    setBrushSize(parseInt(e.target.value));
  };

  const handleCapture = async () => {
    console.log("holaaaa")
    if (shirtRef.current) {
      const canvas = await html2canvas(shirtRef.current);
      const dataUrl = canvas.toDataURL('image/png');
      
      // Luego, podrías subir esta URL o hacer lo que necesites con ella.
      saveImage(dataUrl);
    }
  };

  const saveImage = (dataUrl) => {
    // Aquí podrías usar una API para subir la imagen o guardarla en algún lugar
    // Por ahora, solo imprimimos el dataUrl.
    console.log(dataUrl);
    
    // Crear un enlace para descargar la imagen
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'captured-image.png';

    link.addEventListener('click', () => {
      console.log('El enlace fue presionado.');
      saveShirt(dataUrl);
    });

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveShirt = async (dataUrl) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${config.url}/design/save`, {
        headers: { Authorization: `Bearer ${token}` },
        body: {newUrl: dataUrl}
      });

    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };


  return (
    <div className="designer">
      <h2>Create a Design</h2>
      <div className="controls">
        <label>
          Color:
          <input type="color" value={color} onChange={handleColorChange} />
        </label>
        <label>
          Pattern:
          <select value={pattern} onChange={handlePatternChange}>
            <option value="none">None</option>
            <option value="stripes">Stripes</option>
            <option value="dots">Dots</option>
            <option value="diagonal-stripes">Diagonal Stripes</option>
            <option value="grid">Grid</option>
            <option value="zigzag">Zig Zag</option>
          </select>
        </label>
        <label>
          Pattern Color:
          <input type="color" onChange={handlePatternColorChange} />
        </label>
        <button onClick={addTextInput}>+ Text</button>
        {texts.map((text) => (
          <div key={text.id}>
            <input type="text" value={text.text} onChange={(e) => handleTextChange(text.id, e.target.value)} />
            <button onClick={() => removeTextInput(text.id)}>-</button>
            <label>
              Font Color:
              <input
                type="color"
                value={text.color}
                onChange={(e) => handleFontColorChange(text.id, e.target.value)}
              />
            </label>
            <label>
              Font Size:
              <input
                type="number"
                value={parseInt(text.fontSize, 10)}
                onChange={(e) => handleFontSizeChange(text.id, `${e.target.value}px`)}
              />
            </label>
            <label>
              Font Family:
              <select
                value={text.fontFamily}
                onChange={(e) => handleFontFamilyChange(text.id, e.target.value)}
              >
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
              </select>
            </label>
          </div>
        ))}
        <button onClick={addShape}>+ Shape</button>
        {shapes.map((shape) => (
          <div key={shape.id}>
            <select
              value={shape.shape}
              onChange={(e) => handleShapeChange(shape.id, e.target.value)}
            >
              <option value="square">Square</option>
              <option value="circle">Circle</option>
              <option value="rectangle">Rectangle</option>
              <option value="triangle">Triangle</option>
              <option value="diamond">Diamond</option>
            </select>
            <button onClick={() => removeShape(shape.id)}>-</button>
          </div>
        ))}
        <input type="file" onChange={addImage} accept="image/*" id="file" ref={inputFile} />
        {images.map((im, index) => (
          <div key={index} className="uploaded-image-container">
            <img src={im.src} alt={`Uploaded ${index}`} className="uploaded-image" />
            <p>{im.name}</p>
          </div>
        ))}
        <label>
          Drawing Color:
          <input type="color" value={drawingColor} onChange={(e) => setDrawingColor(e.target.value)} />
        </label>
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
      </div>
      <div
        className="preview"
        onMouseDown={handleDrawStart}
        onMouseMove={handleDrawMove}
        onMouseUp={handleDrawEnd}
        onMouseLeave={handleDrawEnd}
      >
        <div  className="shirt" ref={shirtRef}>
        {drawingLines.map((line, index) => (
         
         <div
         key={index}
         className="drawing-line"
         style={{
           left: line.x1 - line.width / 2,
           top: line.y1 - line.width / 2,
           width: `${line.width}px`,
           height: `${line.width}px`,
           backgroundColor: line.color,
           borderRadius: '50%',
         }}
       />
          ))}
          <img src={shirt}  alt="Shirt" className="shirt-image" />
          {images.map((image, index) => (
            <div key={index} className="uploaded-image-container">
              <img src={image.src} alt={`Uploaded ${index}`} className="uploaded-image" />
              <p>{image.name}</p>
            </div>
          ))}
           
          <div className="color-overlay" style={{ backgroundColor: color }}></div>
          <div className={`pattern-overlay ${pattern}`}></div>
          {texts.map((text) => (
            <Rnd
              key={text.id}
              size={{ width: text.width, height: text.height }}
              position={{ x: text.x, y: text.y }}
              bounds=".shirt"
              onDragStop={(e, d) => handleTextDragStop(text.id, d.x, d.y)}
              onResizeStop={(e, direction, ref, delta, position) => {
                handleTextResizeStop(text.id, parseInt(ref.style.width, 10), parseInt(ref.style.height, 10));
                handleTextDragStop(text.id, position.x, position.y);
              }}
              enableResizing={{
                top: true,
                right: true,
                bottom: true,
                left: true,
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true,
              }}
            >
              <div
                className="text-overlay"
                style={{ fontSize: text.fontSize, fontFamily: text.fontFamily, width: '100%', height: '100%', color: text.color }}
              >
                {text.text}
              </div>
            </Rnd>
          ))}
          {shapes.map((shape) => (
            <Rnd
              className="rnd"
              key={shape.id}
              size={{ width: shape.width, height: shape.height }}
              position={{ x: shape.x, y: shape.y }}
              bounds=".shirt"
              onDragStop={(e, d) => handleShapeDragStop(shape.id, d.x, d.y)}
              onResizeStop={(e, direction, ref, delta, position) => {
                handleShapeResizeStop(shape.id, parseInt(ref.style.width, 10), parseInt(ref.style.height, 10));
                handleShapeDragStop(shape.id, position.x, position.y);
              }}
              enableResizing={{
                top: true,
                right: true,
                bottom: true,
                left: true,
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true,
              }}
            >
              <div
                className={`shape-overlay ${shape.shape}`}
                style={{ width: `${shape.width}px`, height: `${shape.height}px` }}
              ></div>
            </Rnd>
          ))}
         
        </div>
        
      </div>
      <button onClick={handleCapture}>Capturar y Guardar Imagen</button>
    </div>
  );
};

export default Designer;