import React, { useContext, useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import './designer.css';
import shirt from '../vendor/imgs/shirtpng.png';
import html2canvas from 'html2canvas';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import config from '../config';
import { useLocation } from 'react-router-dom';
import DiseñadorCanvas from './DiseñadorCanvas'; //hay un error aca //arreglado
import { useNavigate } from 'react-router-dom';

const Designer = () => {
  const location = useLocation();
  const { designId } = location.state || {};
  const { isLoggedIn, setIsLoggedIn,strictCheckAuth } = useContext(AuthContext);
  const shirtRef = useRef(null);
  const [color, setColor] = useState('rgb(255,255,255)');
  const [pattern, setPattern] = useState('none');
  const [texts, setTexts] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [images, setImage] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingCoords, setDrawingCoords] = useState({ x: 0, y: 0 });
  const [drawingLines, setDrawingLines] = useState([]);
  const [canDraw, setCanDraw] = useState(false);
  const inputFile = useRef(null);   

  const navigate = useNavigate();

 

  const getShirt = async () => {
    const token = localStorage.getItem('token');
    try {

      const response = await axios.get(`${config.url}design/get/${designId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      
      const data = JSON.parse(response.data);

      console.log("response",data);

      setColor(data.info.design_data.color || 'rgb(255,255,255)');
      setPattern(data.info.design_data.pattern || 'none');
      setTexts(Array.isArray(data.info.design_data.texts) ? data.info.design_data.texts : []);
      setShapes(Array.isArray(data.info.design_data.shapes) ? data.info.design_data.shapes : []);
      setImage(Array.isArray(data.info.design_data.image) ? data.info.design_data.image : []);
      setDrawingLines(Array.isArray(data.info.design_data.drawingLines) ? data.info.design_data.drawingLines : []);
      
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    if (designId) {
      getShirt();
    }
  }, [designId]);
  
  useEffect(() => {
    let authcheck;const checkauth = async () => {return strictCheckAuth(navigate)};checkauth()
  },[])

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
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === id ? { ...shape, x, y } : shape
      )
    );
  };

  const handleShapeResizeStop = (id, width, height) => {
    console.log('Resizing shape:', id, 'New width:', width, 'New height:', height);
  
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === id ? { ...shape, width, height } : shape
      )
    );
  };

  
    
  

  const handleDrawStart = (event) => {
    setIsDrawing(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setDrawingCoords({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const handleDrawMove = (event) => {
    if (isDrawing && canDraw) {
      const rect = event.currentTarget.getBoundingClientRect();
      const newCoords = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      /*
      setDrawingLines((prevLines) => [
        ...prevLines,
        ...interpolateLine(drawingCoords, newCoords, brushSize, drawingColor),
      ]);*/
      
      setDrawingCoords(newCoords);
    }
  };

  const handleDrawEnd = () => {
    setIsDrawing(false);
  };

 

  const handleCapture = async () => {
    console.log("holaaaa");
    if (shirtRef.current) {
      const canvas = await html2canvas(shirtRef.current);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // El segundo parámetro es la calidad (0.0 a 1.0)
      
      // Luego, podrías subir esta URL o hacer lo que necesites con ella.
      saveImage(dataUrl);
    }
  };

  const saveImage = (dataUrl) => {
    const link = document.createElement('a');
    link.href = dataUrl;
  
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Evita la descarga
      console.log('El enlace fue presionado, guardando en la base de datos.');
      saveShirt(dataUrl); // Llama a la función para guardar en la BD
    });
  
    // Simula el click, pero no descarga el archivo
    link.click();
  }


  const saveShirt = async (dataUrl) => {
    
    const designData = {
      color,        // Color de fondo
      pattern,      // Patrón seleccionado
      texts,        // Textos con posición, tamaño, color, fuente, etc.
      shapes,       // Formas con posición, tamaño, tipo, etc.
      images,       // Imágenes subidas
      drawingLines, // Líneas dibujadas con pincel
    };
    const designJSON = JSON.stringify(designData);
    console.log(designJSON);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${config.url}design/save`, { designId: designId, image: dataUrl, designData: designJSON }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Camiseta guardada:', response.data);
    } catch (error) {
      console.error('Error al guardar la camiseta:', error);
    }

  };

  const interpolateLine = (start, end, size, color) => {
    const points = [];
    const numPoints = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y)) / (size/6);
    for (let i = 0; i < numPoints; i++) {
      const x = start.x + (end.x - start.x) * (i / numPoints);
      const y = start.y + (end.y - start.y) * (i / numPoints);
      points.push({ x, y, size, color });
    }
    return points;
  };

  return (
    <div className="designer">
      <DiseñadorCanvas></DiseñadorCanvas>
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
        <button class="designer-button" onClick={addTextInput}>+ Text</button>
        {texts && texts.map((text) => (
          <div key={text.id}>
            <input type="text" value={text.text} onChange={(e) => handleTextChange(text.id, e.target.value)} />
            <button class="designer-button" onClick={() => removeTextInput(text.id)}>-</button>
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
        <button class="designer-button" onClick={addShape}>+ Shape</button>
        {shapes && shapes.map((shape) => (
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
            <button class="designer-button" onClick={() => removeShape(shape.id)}>-</button>
          </div>
        ))}
        <input type="file" onChange={addImage} accept="image/*" id="file" ref={inputFile} />
        {images && images.map((im, index) => (
          <div key={index} className="uploaded-image-container">
            <img src={im.src} alt={`Uploaded ${index}`} className="uploaded-image" />
            <p>{im.name}</p>
          </div>
        ))}



      
        
      </div>
      <div
        className="preview"
        onMouseDown={handleDrawStart}
        onMouseMove={handleDrawMove}
        onMouseUp={handleDrawEnd}
        onMouseLeave={handleDrawEnd}
      >
        <div className="shirt" ref={shirtRef}>
          {drawingLines && drawingLines.map((line, index) => (
            <div
              key={index}
              className="drawing-line"
              style={{
                left: line.x - line.size / 2,
                top: line.y - line.size / 2,
                width: `${line.size}px`,
                height: `${line.size}px`,
                backgroundColor: line.color,
                borderRadius: '50%',
                position: 'absolute',
              }}
            />
          ))}
          <img src={shirt} alt="Shirt" className="shirt-image" />
          {images && images.map((image, index) => (
            <div key={index} className="uploaded-image-container">
              <img src={image.src} alt={`Uploaded ${index}`} className="uploaded-image" />
              <p>{image.name}</p>
            </div>
          ))}
          <div className="color-overlay" style={{ backgroundColor: color }}></div>
          <div className={`pattern-overlay ${pattern}`}></div>
          {texts && texts.map((text) => (
            <Rnd
              key={text.id} 
              size={{ width: text.width, height: text.height }}
              position={{ x: text.x, y: text.y }}
              bounds=".shirt"
              onDragStart={() => setCanDraw(false)}
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
          {shapes && shapes.map((shape) => (
          <Rnd
            className="rnd"
            key={shape.id}
            size={{ width: shape.width, height: shape.height }}
            position={{ x: shape.x, y: shape.y }}
            bounds=".shirt"
            onDragStart={() => setCanDraw(false)}
            onDragStop={(e, d) => handleShapeDragStop(shape.id, d.x, d.y)}
            onResizeStop={(e, direction, ref, delta, position) => {
              const newWidth = ref.offsetWidth;
              const newHeight = ref.offsetHeight;
              handleShapeResizeStop(shape.id, newWidth, newHeight);
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
              style={{ width: '100%', height: '100%' }}
            ></div>
          </Rnd>
        ))}
        </div>
      </div>
      <button class="designer-button" onClick={handleCapture}>Capturar y Guardar Imagen</button>
    </div>
  );
};

export default Designer;
