import React, { useState, useEffect } from 'react';

const BrushTool = ({ canvasRef, backgroundImage, drawImageOnTop, brushColor, brushSize }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawings, setDrawings] = useState([]); // Para almacenar los trazos

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!canvas || !context) return;

    context.lineCap = 'round';

    // Función para empezar a dibujar
    const startDrawing = (e) => {
      context.strokeStyle = brushColor;
      context.lineWidth = brushSize;
      context.beginPath();
      context.moveTo(e.offsetX, e.offsetY);
      setIsDrawing(true);
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
    
    // Función para dibujar
    const draw = (e) => {
      if (!isDrawing) return;
      
      // Guardar la posición actual
      const newX = e.offsetX;
      const newY = e.offsetY;
    
      context.lineTo(newX, newY);
      context.stroke();
    
      // Guardar el trazo en el array
      setDrawings((prevDrawings) => [
        ...prevDrawings,
        { x: newX, y: newY, color: brushColor, size: brushSize }
      ]);
    
      // Redibujar la imagen de fondo
      if (backgroundImage) {
        drawImageOnTop(backgroundImage);
      }
    };
    

    // Función para dejar de dibujar
    const stopDrawing = () => {
      setIsDrawing(false);
    };

    // Agregar listeners de eventos de mouse
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Cleanup: remover listeners cuando se desmonte el componente
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
    };
  }, [brushColor, brushSize, isDrawing, canvasRef, backgroundImage, drawImageOnTop]);

  return (
   <></>
  );
};

export default BrushTool;
