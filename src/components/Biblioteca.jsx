import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Biblioteca.css'; 
import axios from 'axios';
import config from '../config';
import Carta from './carta.jsx';
import bagicon from '../vendor/imgs/bagicon.png';

const LibraryPage = () => {
  const [items, setItems] = useState({ saved: [], liked: [] });
  const [activeTab, setActiveTab] = useState('liked');
  const [activeFilter, setActiveFilter] = useState('liked'); // Nuevo estado para manejar el filtro activo
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(config.url + 'user/library', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("api data ", response);
        
        if (response.data && typeof response.data === 'object') {
          if (Array.isArray(response.data.saved) && Array.isArray(response.data.liked)) {
            setItems(response.data);
          } else {
            setError("API response format is incorrect");
            console.error("Incorrect data format:", response.data);
          }
        } else {
          setError("Invalid API response");
          console.error("Invalid response:", response.data);
        }
      } catch (error) {
        setError("Error fetching items");
        console.error('Error fetching items', error);
      }
    };
    fetchItems();
  }, []);

  const setItemsGuardados = () => {
    setActiveTab('saved');
    setActiveFilter('saved'); // Actualiza el filtro activo
  };

  const setItemsLikeados = () => {
    setActiveTab('liked');
    setActiveFilter('liked'); // Actualiza el filtro activo
  };

  const handleViewDesign = (postId) => {
    navigate(`/post/${postId}`);
  };

  const displayedItems = items[activeTab] || [];

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="fondo">
    <div className="library-container">
      <div className='contaiAyCasiEhTePensasteQueLoIbaADecirFzJajajajajaNadaMeDetendra'>
        <div className="filtros">
          <h2 className='libraryTitle'>Mi biblioteca</h2>
          <div className='filtericons'>
            <div className={`filter-container ${activeFilter === 'saved' ? 'active' : ''}`}>
              <button onClick={setItemsGuardados} className={activeTab === 'saved' ? 'active' : ''}>
                <img className="iconLibrary" src={bagicon} alt="ss" />
              </button>
            </div>
            <div className={`filter-container ${activeFilter === 'liked' ? 'active' : ''}`}>
              <button onClick={setItemsLikeados} className={activeTab === 'liked' ? 'active' : ''}>
                <img className="iconLibrary" src={bagicon} alt="ss" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="cuadrado">
        <div className="library-grid" key={activeTab}>
          {displayedItems.map((item, index) => (
             
            <div 
              key={`${activeTab}-${item.id}-${index}`} 
              className="library-item" 
             
            >
              <Carta 
              
                post_id={item.id} 
                cloth={item.front_image} 
                profile_photo={item.profile_photo}
                
              />
            </div>
            
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default LibraryPage;
