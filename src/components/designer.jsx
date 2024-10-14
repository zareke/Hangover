import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import './designer.css';
import shirt from '../vendor/imgs/shirtpng.png';
import html2canvas from 'html2canvas';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import config from '../config';
import { useLocation } from 'react-router-dom';

const Designer = () => {
  const location = useLocation();
  const { designId } = location.state || {};
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const shirtRef = useRef(null);
  const [color, setColor] = useState('#FFFFFF');
  const [pattern, setPattern] = useState('none');
  const [texts, setTexts] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [images, setImages] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState(null);
  const [paths, setPaths] = useState([]);
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [canDraw, setCanDraw] = useState(false);
  const inputFile = useRef(null);   
  const [activeImageId, setActiveImageId] = useState(null);
  const getShirt = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${config.url}design/get/${designId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = JSON.parse(response.data);

      console.log("response", data);

      setColor(data.info.design_data.color || 'rgb(255,255,255)');
      setPattern(data.info.design_data.pattern || 'none');
      setTexts(Array.isArray(data.info.design_data.texts) ? data.info.design_data.texts : []);
      setShapes(Array.isArray(data.info.design_data.shapes) ? data.info.design_data.shapes : []);
      setImages(Array.isArray(data.info.design_data.image) ? data.info.design_data.image : []);
      setPaths(Array.isArray(data.info.design_data.paths) ? data.info.design_data.paths : []);
      
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }, [designId]);

  useEffect(() => {
    if (designId) {
      getShirt();
    }
  }, [designId, getShirt]);
  
  const handleColorChange = (e) => setColor(e.target.value);
  const handlePatternChange = (e) => setPattern(e.target.value);
  const handlePatternColorChange = (e) => document.documentElement.style.setProperty('--pattern-color', e.target.value);

  const addTextInput = () => {
    setTexts(prevTexts => [...prevTexts, { id: Date.now(), text: '', x: 50, y: 50, width: 100, height: 50, fontSize: '16px', fontFamily: 'Arial' }]);
  };
  const handleImageDragStart = (id) => {
    setActiveImageId(id);
    setCanDraw(false);
  };
  
  const handleImageResizeStart = (id) => {
    setActiveImageId(id);
    setCanDraw(false);
  };
  const removeTextInput = (id) => {
    setTexts(prevTexts => prevTexts.filter((text) => text.id !== id));
  };

  const handleTextChange = (id, newText) => {
    setTexts(prevTexts => prevTexts.map((text) => (text.id === id ? { ...text, text: newText } : text)));
  };

  const handleTextDragStop = (id, x, y) => {
    setTexts(prevTexts => prevTexts.map((text) => (text.id === id ? { ...text, x, y } : text)));
  };

  const handleTextResizeStop = (id, width, height) => {
    const newFontSize = Math.min(width, height) / 5; // Adjust as needed
    setTexts(prevTexts => prevTexts.map((text) => (text.id === id ? { ...text, width, height, fontSize: `${newFontSize}px` } : text)));
  };

  const handleFontColorChange = (id, color) => {
    setTexts(prevTexts => prevTexts.map((text) => (text.id === id ? { ...text, color } : text)));
  };

  const handleFontSizeChange = (id, fontSize) => {
    const newFontSize = parseInt(fontSize, 10);
    fontSize = newFontSize > 100 ? "60px" : `${newFontSize}px`;
    setTexts(prevTexts => prevTexts.map((text) => (text.id === id ? { ...text, fontSize } : text)));
  };

  const handleFontFamilyChange = (id, family) => {
    setTexts(prevTexts => prevTexts.map((text) => (text.id === id ? { ...text, fontFamily: family } : text)));
  };

  const addShape = () => {
    setShapes(prevShapes => [...prevShapes, { id: Date.now(), shape: 'square', x: 50, y: 50, width: 50, height: 50 }]);
  };

  const addImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImages(prevImages => [...prevImages, { 
        id: Date.now(), 
        src: reader.result, 
        name: file.name, 
        x: 50, 
        y: 50, 
        width: 100, 
        height: 100 
      }]);
    };
    reader.readAsDataURL(file);
  };
  const handleImageResizeStop = (id, ref, position) => {
    setImages(prevImages => prevImages.map((image) => {
      if (image.id === id) {
        return {
          ...image,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y
        };
      }
      return image;
    }));
    setActiveImageId(null);
  };

  const handleImageDragStop = (id, x, y) => {
    setImages(prevImages => prevImages.map((image) => 
      (image.id === id ? { ...image, x, y } : image)
    ));
    setActiveImageId(null);
  };
  
  const removeImage = (id) => {
    setImages(prevImages => prevImages.filter((image) => image.id !== id));
  };

  const removeShape = (id) => {
    setShapes(prevShapes => prevShapes.filter((shape) => shape.id !== id));
  };

  const handleShapeChange = (id, newShape) => {
    setShapes(prevShapes => prevShapes.map((shape) => (shape.id === id ? { ...shape, shape: newShape } : shape)));
  };

  const handleShapeDragStop = (id, x, y) => {
    setShapes(prevShapes => prevShapes.map((shape) => shape.id === id ? { ...shape, x, y } : shape));
  };

  const handleShapeResizeStop = (id, width, height) => {
    console.log('Resizing shape:', id, 'New width:', width, 'New height:', height);
    setShapes(prevShapes => prevShapes.map((shape) => shape.id === id ? { ...shape, width, height } : shape));
  };

  const handleDrawStart = (event) => {
    if (!canDraw) return;
    
    setIsDrawing(true);
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newPath = {
      points: [{x, y}],
      color: drawingColor,
      size: brushSize
    };
    
    setCurrentPath(newPath);
  };
  
  const handleDrawMove = useCallback((event) => {
    if (!isDrawing || !canDraw) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setCurrentPath(prevPath => {
      if (!prevPath) return null;
      return {
        ...prevPath,
        points: [...prevPath.points, {x, y}]
      };
    });
  }, [isDrawing, canDraw]);
  
  const handleDrawEnd = () => {
    if (!isDrawing || !currentPath) return;
    
    setPaths(prevPaths => [...prevPaths, currentPath]);
    setCurrentPath(null);
    setIsDrawing(false);
  };

  const handleBrushSizeChange = (e) => {
    setBrushSize(parseInt(e.target.value));
  };

  const handleCapture = async () => {
    console.log("Capturing image...");
    if (shirtRef.current) {
      const canvas = await html2canvas(shirtRef.current);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      saveImage(dataUrl);
    }
  };

  const saveImage = (dataUrl) => {
    const link = document.createElement('a');
    link.href = dataUrl;
  
    link.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Link pressed, saving to database.');
      saveShirt(dataUrl);
    });
  
    link.click();
  }

  const saveShirt = async (dataUrl) => {
    const designData = {
      color,
      pattern,
      texts,
      shapes,
      images,
      paths, 
    };
    const designJSON = JSON.stringify(designData);
    console.log(designJSON);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${config.url}design/save`, { designId: designId, image: dataUrl, designData: designJSON }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Shirt saved:', response.data);
    } catch (error) {
      console.error('Error saving shirt:', error);
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
        <button className="designer-button" onClick={addTextInput}>+ Text</button>
        {texts && texts.map((text) => (
          <div key={text.id}>
            <input
              type="text"
              className="gamer"
              value={text.text}
              onChange={(e) => handleTextChange(text.id, e.target.value)}
            />
            <button className="designer-button" onClick={() => removeTextInput(text.id)}>-</button>
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
        
        <button className="designer-button" onClick={addShape}>+ Shape</button>
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
            <button className="designer-button" onClick={() => removeShape(shape.id)}>-</button>
          </div>
        ))}
        <input type="file" onChange={addImage} accept="image/*" id="file" ref={inputFile} />
        {images && images.map((image) => (
  <div key={image.id}>
    <p>{image.name}</p>
    <button className="designer-button" onClick={() => removeImage(image.id)}>
      Remove Image
    </button>
  </div>
))}

        <button 
          className={`designer-button ${canDraw ? 'active' : ''}`} 
          onClick={() => setCanDraw(!canDraw)}
        >
          {canDraw ? '✏️ Drawing Mode (On)' : '✏️ Drawing Mode (Off)'}
        </button>

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
        <div className="shirt" ref={shirtRef}>
          
          <svg 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1000
            }}
          >
            {paths.map((path, pathIndex) => (
              <path
                key={pathIndex}
                d={`M ${path.points[0].x} ${path.points[0].y} ${path.points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
                stroke={path.color}
                strokeWidth={path.size}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {currentPath && (
              <path
                d={`M ${currentPath.points[0].x} ${currentPath.points[0].y} ${currentPath.points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
                stroke={currentPath.color}
                strokeWidth={currentPath.size}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
          <img src={shirt} alt="Shirt" className="shirt-image" />
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
 {images && images.map((image) => (
      <Rnd
        key={image.id}
        size={{ width: image.width, height: image.height }}
        position={{ x: image.x, y: image.y }}
        onDragStart={() => handleImageDragStart(image.id)}
        onDragStop={(e, d) => handleImageDragStop(image.id, d.x, d.y)}
        onResizeStart={() => handleImageResizeStart(image.id)}
        onResizeStop={(e, direction, ref, delta, position) => {
          handleImageResizeStop(image.id, ref, position);
        }}
        bounds=".shirt"
        style={{
          zIndex: activeImageId === image.id ? 1000 : 1,
        }}
      >
        <img 
          src={image.src} 
          alt={image.name} 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
        />
      </Rnd>
    ))}
        </div>
      </div>
      <button className="designer-button" onClick={handleCapture}>Capture and Save Image</button>
    </div>
  );
};

export default Designer;