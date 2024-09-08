import React, { useState } from 'react';
import Draggable from 'react-draggable';
import './designer.css';
import shirt from '../vendor/imgs/shirtpng.png';

const Designer = () => {
  const [color, setColor] = useState('#ffffff');
  const [pattern, setPattern] = useState('none');
  const [texts, setTexts] = useState([]);
  const [shapes, setShapes] = useState([]);

  const handleColorChange = (e) => setColor(e.target.value);
  const handlePatternChange = (e) => setPattern(e.target.value);
  const handlePatternColorChange = (e) => document.documentElement.style.setProperty('--pattern-color', e.target.value);

  const addTextInput = () => {
    setTexts([...texts, { id: Date.now(), text: '', x: 50, y: 50 }]);
  };

  const removeTextInput = (id) => {
    setTexts(texts.filter((text) => text.id !== id));
  };

  const handleTextChange = (id, newText) => {
    setTexts(texts.map((text) => (text.id === id ? { ...text, text: newText } : text)));
  };

  const handleDragStop = (id, x, y) => {
    setTexts(texts.map((text) => (text.id === id ? { ...text, x, y } : text)));
  };

  const addShape = () => {
    setShapes([...shapes, { id: Date.now(), shape: 'square', x: 50, y: 50 }]);
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

  return (
    <div className="designer">
      <h2>Crear un diseño</h2>
      <div className="controls">
        <label>
          Color:
          <input type="color" value={color} onChange={handleColorChange} />
        </label>
        <label>
          Patron:
          <select value={pattern} onChange={handlePatternChange}>
            <option value="none">Ninguno</option>
            <option value="stripes">Rayas</option>
            <option value="dots">Puntos</option>
            <option value="diagonal-stripes">Rayas diagonales</option>
            <option value="grid">Cuadriculado</option>
            <option value="zigzag">Zig Zag</option>
          </select>
        </label>
        <label>
          Color del patron:
          <input type="color" onChange={handlePatternColorChange} />
        </label>
        <button onClick={addTextInput}>+ Texto</button>
        {texts.map((text) => (
          <div key={text.id}>
            <input
              type="text"
              value={text.text}
              onChange={(e) => handleTextChange(text.id, e.target.value)}
            />
            <button onClick={() => removeTextInput(text.id)}>-</button>
          </div>
        ))}
        <button onClick={addShape}>+ Forma</button>
        {shapes.map((shape) => (
          <div key={shape.id}>
            <select
              value={shape.shape}
              onChange={(e) => handleShapeChange(shape.id, e.target.value)}
            >
              <option value="square">Cuadrado</option>
              <option value="circle">Circulo</option>
              <option value="rectangle">Rectangulo</option>
              <option value="triangle">Triangulo</option>
              <option value="diamond">Rombo</option>
            </select>
            <button onClick={() => removeShape(shape.id)}>-</button>
          </div>
        ))}
      </div>
      <div className="preview">
        <div className="shirt">
          <img src={shirt} alt="Shirt" className="shirt-image" />
          <div className="color-overlay" style={{ backgroundColor: color }}></div>
          <div className={`pattern-overlay ${pattern}`}></div>
          {texts.map((text) => (
            <Draggable
              key={text.id}
              defaultPosition={{ x: text.x, y: text.y }}
              bounds=".shirt"
              onStop={(e, data) => handleDragStop(text.id, data.x, data.y)}
            >
              <div className="text-overlay">
                {text.text}
              </div>
            </Draggable>
          ))}
          {shapes.map((shape) => (
            <Draggable
              key={shape.id}
              defaultPosition={{ x: shape.x, y: shape.y }}
              bounds=".shirt"
              onStop={(e, data) => handleShapeDragStop(shape.id, data.x, data.y)}
            >
              <div className={`shape-overlay ${shape.shape}`}></div>
            </Draggable>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Designer;