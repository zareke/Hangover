import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Biblioteca.css'; 
import axios from 'axios';
import config from '../config';
import Carta from './carta.jsx';
import likedIcon from '../vendor/imgs/heart.svg'
import savedIcon from '../vendor/imgs/bookmark.svg'

const LibraryPage = () => {
  const [items, setItems] = useState({ saved: [], liked: [] });
  const [activeTab, setActiveTab] = useState('liked');
  const [activeFilter, setActiveFilter] = useState('liked'); 
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
    setActiveFilter('saved');
  };

  const setItemsLikeados = () => {
    setActiveTab('liked');
    setActiveFilter('liked');
  };

  const handleViewDesign = (postId) => {
    navigate(`/post/${postId}`);
  };

  // Validar que `displayedItems` sea un array antes de mapear
  const displayedItems = Array.isArray(items[activeTab]) ? items[activeTab] : [];

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
              <div onClick={setItemsGuardados} className={`filter-container ${activeFilter === 'saved' ? 'active' : ''}`}>
                
                  <img className="iconLibrary" src={savedIcon} alt="ss" />
                
              </div>
              <div onClick={setItemsLikeados} className={`filter-container ${activeFilter === 'liked' ? 'active' : ''}`}>
              
                  <img className="iconLibrary" src={likedIcon} alt="ss" />
               
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
                onClick={() => handleViewDesign(item.id)}
              >
              <Carta 
  className={`cardGroup${index}`} 
  post_id={item.id} 
  cloth={item.front_image} 
  profile_photo={item.profile_photo}
  username={item.username} 
  user_id={item.user_id}
  onClickFunction={() => handleViewDesign(item.id)}
  putLike={false} // Ajusta esto según sea necesario
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
