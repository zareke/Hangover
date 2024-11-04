import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import './designer.css';
import shirt from '../vendor/imgs/shirtpng.png';
import html2canvas from 'html2canvas';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import config from '../config';
import ContextMenu from './ContextMenu';
import { redirect, useLocation, useNavigate } from 'react-router-dom';

const Designer = () => {
  const location = useLocation();
  const { designId } = location.state || {};
  const { isLoggedIn, setIsLoggedIn, openModalNavBar } = useContext(AuthContext);
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
  const [currentView, setCurrentView] = useState('front');
  const [hasChanges, setHasChanges] = useState(false); //
  const [selectedItem, setSelectedItem] = useState(null);
  const [zindexes,setZindexes]=useState([])
  const {brushColor,setBrushColor}=useState("rgba(56, 117, 109, 1)")

  const Z_DISPONIBLE  = 10000

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuOptions, setContextMenuOptions] = useState([]);



  const [elements, setElements] = useState({ //
    front: {
      texts: [],
      shapes: [],
      images: [],
      paths: [],
    },
    back: {
      texts: [],
      shapes: [],
      images: [],
      paths: [],
    }
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [savedShirtId, setSavedShirtId] = useState(null)
  const [designData, setDesignData] = useState({ //
    color,
    pattern,
    texts,
    shapes,
    images,
    paths,
  });
  //
  useEffect(() => {
    const saveDesignToLocalStorage = () => {
      const storedDesign = localStorage.getItem('design');
      const isDuplicate = storedDesign && JSON.stringify(designData) === storedDesign;
      if (!isDuplicate) {
        localStorage.setItem('design', JSON.stringify(designData));
      }
    };

    saveDesignToLocalStorage();
  }, [color, pattern, texts, shapes, images, paths]);
  useEffect(() => {
    setDesignData({//
      color,
      pattern,
      texts,
      shapes,
      images,
      paths,
    });
    setHasChanges(true); // Marca como cambiado cuando se actualiza el diseño
  }, [color, pattern, texts, shapes, images, paths]);


  /*useEffect(() => { //ORDENAR Z USADO CADA VEZ QUE CAMBIA
    setZindexes((prevZUsado) => [...prevZUsado].sort((a, b) => a - b));
  }, [zindexes])*/

  const nav = useNavigate();

  const getShirt = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${config.url}design/get/${designId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = JSON.parse(response.data);


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
      const z = newObjectZ()
      const newText = { id: Date.now(), text: 'Texto de ejemplo', x: 50, y: 50, z:z, width: 100, height: 50, fontSize: '16px', fontFamily: 'Arial',  view: currentView }
      setTexts(prevTexts => [...prevTexts, newText]);
      setSelectedItem(newText);
    };  

 
  const newObjectZ = () => {
    let z = Math.floor(Z_DISPONIBLE / 2); // Start at the middle

    // Find the closest available z-index
    if (!zindexes.includes(z)) {
      setZindexes((prev) => [...prev, z].sort((a, b) => a - b));
      return z;
    }

    let offset = 1;
    while (true) {
      if (!zindexes.includes(z + offset)) {
        setZindexes((prev) => [...prev, z + offset].sort((a, b) => a - b));
        return z + offset;
      }
      if (!zindexes.includes(z - offset)) {
        setZindexes((prev) => [...prev, z - offset].sort((a, b) => a - b));
        return z - offset;
      }
      offset++;
    }
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
    setSelectedItem(null)
  };

  const handleTextChange = (id, newText) => {
    setTexts(prevTexts => prevTexts.map((text) => (text.id === id ? { ...text, text: newText } : text)));
    selectedItem.text = newText
  };

  const handleImageResizeStop = (id, _width,_height, position) => {
    setImages(prevImages => prevImages.map((image) => {
      if (image.id === id) {
        return {
          ...image,
          width: _width,
          height: _height,
          x: position.x,
          y: position.y
        };
      }
      return image;
    }));
    setActiveImageId(null);
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
    fontSize = newFontSize > 100 ? "100px" : `${newFontSize}px`;
    fontSize = newFontSize < 0 ? "0" : `${newFontSize}px`;
    setTexts(prevTexts => prevTexts.map((text) => (text.id === id ? { ...text, fontSize } : text)));
    selectedItem.fontSize = fontSize
  };

  const handleFontFamilyChange = (id, family) => {
    setTexts(prevTexts => prevTexts.map((text) => (text.id === id ? { ...text, fontFamily: family } : text)));
  };

  const addShape = () => {
    const z = newObjectZ()
    const newShape={ id: Date.now(), shape: 'square', x: 50, y: 50,z:z, width: 50, height: 50,  view: currentView }
    setShapes(prevShapes => [...prevShapes, newShape]);
    setSelectedItem(newShape)
  };

  const addImage = (event) => {
    const z = newObjectZ()
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImages(prevImages => [...prevImages, { 
        id: Date.now(), 
        src: reader.result, 
        name: file.name, 
        x: 50, 
        y: 50, 
        z: z,
        width: 100, 
        height: 100,
        view: currentView
      }]);
      const newImage= { 
        id: Date.now(), 
        src: reader.result, 
        name: file.name, 
        x: 50, 
        y: 50, 
        width: 100, 
        height: 100,
        view: currentView
      };
      setSelectedItem(newImage)
    };
  


   
      if (event.target.files[0]) {
          // ...
          event.target.value = "";
      }
  
    reader.readAsDataURL(file);

  };
 
  const moveItem = (id, direction, type) => {
    let items, setItems;
    if (type === "text") {
      items = texts;
      setItems = setTexts;
    } else if (type === "shape") {
      items = shapes;
      setItems = setShapes;
    } else if (type === "image") {
      items = images;
      setItems = setImages;
    }

    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex === -1) return;

    const targetItem = items[itemIndex];
    let newZ;

    if (direction === "sendBack") {
      newZ = Math.min(...zindexes) - 1;
    } else if (direction === "bringFront") {
      newZ = Math.max(...zindexes) + 1;
    } else if (direction === "up") {
      newZ = targetItem.z + 1;
    } else if (direction === "down") {
      newZ = targetItem.z - 1;
    }

    // Ensure no duplicates in zindexes
    setZindexes((prev) => [...prev.filter((z) => z !== targetItem.z), newZ].sort((a, b) => a - b));
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, z: newZ } : item
      )
    );
  };

  const handleImageDragStop = (id, x, y) => {
    setImages(prevImages => prevImages.map((image) => 
      (image.id === id ? { ...image, x, y } : image)
    ));
  };
  
  const removeImage = (id) => {
    setImages(prevImages => prevImages.filter((image) => image.id !== id));
    setSelectedItem(null)
  };

  const removeShape = (id) => {
    setShapes(prevShapes => prevShapes.filter((shape) => shape.id !== id));
    setSelectedItem(null)   
  };
  


  const handleShapeChange = (id, newShape) => {
    setShapes(prevShapes => prevShapes.map((shape) => (shape.id === id ? { ...shape, shape: newShape } : shape)));
    selectedItem.shape = newShape
  };

  const handleShapeDragStop = (id, x, y) => {
    setShapes(prevShapes => prevShapes.map((shape) => shape.id === id ? { ...shape, x, y } : shape));
  };

  const handleShapeResizeStop = (id, width, height) => {
    setShapes(prevShapes => prevShapes.map((shape) => shape.id === id ? { ...shape, width, height } : shape));
  };
  
  
  const handleDrawStart = (event) => {
    if (!canDraw) return;
    
    setIsDrawing(true);
    setBrushColor("rgb(68, 138, 128);")
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newPath = {
      points: [{x, y}],
      color: drawingColor,
      size: brushSize,
      view: currentView
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
    setBrushColor("rgba(56, 117, 109, 1)")
  };

  const handleBrushSizeChange = (e) => {
    setBrushSize(parseInt(e.target.value));
  };

  const handleCapture = async () => {
    if (shirtRef.current && isLoggedIn) {
      const canvas = await html2canvas(shirtRef.current);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      saveImage(dataUrl);
      modalPublish();
      setHasChanges(false);
    }else{
      openModalNavBar()
    }
  };

  const modalPublish = () => {
    setModalVisible(true);
  }

  const handleModalClose = () => {
    setModalVisible(false)
  }

  const handlePublicar = () => {
    nav(`/NewPost/${savedShirtId}`)
    
  }

  const saveImage = (dataUrl) => {
    const link = document.createElement('a');
    link.href = dataUrl;
  
    link.addEventListener('click', (e) => {
      e.preventDefault();
      saveShirt(dataUrl);
    });
  
    link.click();
    setHasChanges(false)
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
      setSavedShirtId(response.data)
    } catch (error) {
      console.error('Error saving shirt:', error);
    }
  };

  const showContextMenu = (event) => {
    event.preventDefault(); // Prevent default context menu
    setContextMenuPosition({ x: event.pageX, y: event.pageY });
    setContextMenuOptions([
      { label: 'Add Text', action: addTextOption },
      { label: 'Add Shape', action: addShapeOption },
    ]);
    setContextMenuVisible(true);
  };

  const hideContextMenu = () => {
    setContextMenuVisible(false);
  };

  const addTextOption = () => {
    addTextInput()
    hideContextMenu();
  };

  const addShapeOption = () => {
    addShape()
    hideContextMenu();
  };

  

  const handleRightClickOnItem = (event, item,type) => {
    event.preventDefault();
    event.stopPropagation()
    setContextMenuPosition({ x: event.pageX, y: event.pageY });
    setContextMenuOptions([
      { label: 'Adelante', action: () =>  moveItem(item.id,"up",type) },
      { label: 'Atras', action: () =>  moveItem(item.id,"down",type) },
      { label: 'Traer al frente', action: () =>  moveItem(item.id,"bringFront",type) },
      { label: 'Enviar al fondo', action: () =>  moveItem(item.id,"sendBack",type) },
    ]);
    setContextMenuVisible(true);
  };

  
  return (
    <div className="designer"
    onContextMenu={showContextMenu}>
      <h2>Create a Design</h2>
      
      <div className="view-controls">
        <button 
          className={`view-button ${currentView === 'front' ? 'active' : ''}`}
          onClick={() => setCurrentView('front')}
          
        >
          Front View
        </button>
        <button 
          className={`view-button ${currentView === 'back' ? 'active' : ''}`}
          onClick={() => setCurrentView('back')}
        >
          Back View
        </button>
      </div>
     
<div className="_616southside"> <div className="controls">
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
        
        <button className="designer-button" onClick={addShape}>+ Shape</button>
        
         {/* Imágenes */}
      
         <label for="file-upload" className='designer-button'>+ Image</label>
<input className='inputParaEsconder' type="file" id="file-upload" onChange={addImage} accept="image/*" />

      

        {/* Pincel */}
      <button className={`designer-button ${canDraw ? 'active' : ''}`} onClick={() => setCanDraw(!canDraw)} style={{backgroundColor:{brushColor}}}>
        {canDraw ? '✏️' : '✏️'}
      </button>
      <label>
        Drawing Color:
        <input type="color" value={drawingColor} onChange={(e) => setDrawingColor(e.target.value)} />
      </label>
      <label>
        Brush Size:
        <input type="range" min="1" max="20" value={brushSize} onChange={handleBrushSizeChange} />
        {brushSize}px
      </label>
    </div>
    {selectedItem != null && (
    <div className="properties-panel">

    <div className='properties'>
      <h3>Propiedades</h3>
      {selectedItem.fontSize &&
        (
          
          <div key={selectedItem.id}>
              <label>
                Texto
            <input
              type="text"
              className="gamer"
              value={selectedItem.text}
              onChange={(e) => handleTextChange(selectedItem.id, e.target.value)}
            />
              </label>
            <label>
              Color de fuente
              <input
                type="color"
                value={selectedItem.color}
                onChange={(e) => handleFontColorChange(selectedItem.id, e.target.value)}
              />
            </label>
            <label>
              Tamaño de fuente
              <input
                type="number"
                value={parseInt(selectedItem.fontSize, 10)}
                onChange={(e) => handleFontSizeChange(selectedItem.id, `${e.target.value}px`)}
              />
            </label>
            <label>
              Fuente
              <select
                value={selectedItem.fontFamily}
                onChange={(e) => handleFontFamilyChange(selectedItem.id, e.target.value)}
              >
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
              </select>
            </label>
            <button className="designer-button" onClick={() => removeTextInput(selectedItem.id)}>Eliminar</button>
          </div>
        
        )}
        
      {selectedItem.src && (
      
            <div key={selectedItem.id}>
              
              {console.log(selectedItem)}
              <p>{selectedItem.name}</p>
              <button className="designer-button" onClick={() => removeImage(selectedItem.id)}>Remove Image</button>
            </div>
          )}
     {selectedItem.shape &&
        (
          <div key={selectedItem.id}>
            <select
              value={selectedItem.shape}
              onChange={(e) => handleShapeChange(selectedItem.id, e.target.value)}
            >
              <option value="square">Square</option>
              <option value="circle">Circle</option>
              <option value="rectangle">Rectangle</option>
              <option value="triangle">Triangle</option>
              <option value="diamond">Diamond</option>
            </select>
            <button className="designer-button" onClick={() => removeShape(selectedItem.id)}>-</button>
          </div>
        )}
    </div>
  
</div>)}</div>
      

    <div
      className="preview"
      onMouseDown={handleDrawStart}
      onMouseMove={handleDrawMove}
      onMouseUp={handleDrawEnd}
      onMouseLeave={handleDrawEnd}
    >
      <div className={`shirt ${currentView}`} ref={shirtRef}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }}>
          {paths.filter((path) => path.view === currentView) // Filtrar caminos según la vista actual
            .map((path, pathIndex) => (
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
          {currentPath && currentPath.view === currentView && ( // Filtrar camino actual según la vista actual
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
        <img
          src={shirt}
          alt={`Shirt ${currentView} view`}
          className="shirt-image"
          style={{ transform: currentView === 'back' ? 'scaleX(-1)' : 'none' }}
        />
        <div className="color-overlay" style={{ backgroundColor: color }}></div>
        <div className={`pattern-overlay ${pattern}`}></div>
          <div className={`design-elements ${currentView}`}>
          {texts && texts
  .filter((text) => text.view === currentView) // Filtrar por vista
  .map((text) => (
    <Rnd
    onContextMenu={(e) => handleRightClickOnItem(e, text,"text")} // Handle right-click for the design area

      key={text.id}
      size={{ width: text.width, height: text.height }}
      position={{ x: text.x, y: text.y }}
      style={{zIndex:text.z}} 
      onClick={() => setSelectedItem(text)}
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

          {shapes && shapes.filter((shape) => shape.view === currentView)
          .map((shape) => (
            <Rnd
                onContextMenu={(e) => handleRightClickOnItem(e, shape,"shape")}
              className="rnd"
              key={shape.id}
              onClick={() => setSelectedItem(shape)}
              size={{ width: shape.width, height: shape.height }}
              style={{zIndex:shape.z}} 
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
 {images && images.filter((image) => image.view === currentView)
 .map((image) => (
      <Rnd
      onContextMenu={(e) => handleRightClickOnItem(e, image,"image")} // Handle right-click for the design area
        key={image.id}
        className='rnd'
        bounds=".shirt"
        onClick={() => setSelectedItem(image)}
        size={{ width: image.width, height: image.height }}
        position={{ x: image.x, y: image.y }} 
        onDragStart={() => setCanDraw(false)}
        onDragStop={(e, d) => handleImageDragStop(image.id, d.x, d.y)}
        style={{zIndex:image.z}} 
        onResizeStop={(e, direction, ref, delta, position) => {
          const newWidth = ref.style.width;
          const newHeight = ref.style.height;
          handleImageResizeStop(image.id, newWidth,newHeight, position);
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
        
        <img 
        draggable={false}
          src={image.src} 
          alt={image.name}
          className='image-added'
          style={{ width: '100%', height: '100%' }}
        />
      </Rnd>
    ))} 
        </div>
      </div>
      
      {hasChanges ? (
      <div className="centrador">
        <button className="designer-button" onClick={handleCapture}>
          Guardar diseño {currentView === 'front' ? 'Front' : 'Back'} View
        </button>
      </div>
    ) : (
      <h3>Diseño guardado.</h3> // Mensaje cuando no hay cambios
    )}
    {contextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          position={contextMenuPosition}
          onClose={hideContextMenu}
        />
      )}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            <h2>¡Diseño guardado!</h2>
            <p>¿Quieres publicarlo?</p>
            <div className="modal-actions">
              <button onClick={handlePublicar}>Sí</button>
              <button onClick={handleModalClose}>No</button>
            </div>
          </div>
          </div> 
      )}
    </div>
        </div>
    
  );
};

export default Designer;