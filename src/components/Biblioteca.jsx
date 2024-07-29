import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Biblioteca.css'; 
import axios from 'axios';
import config from '../config';

const LibraryPage = () => {
  const [items, setItems] = useState({ saved: [], liked: [] });
  const [activeTab, setActiveTab] = useState('liked');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(config.url + 'user/library', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
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
  };

  const setItemsLikeados = () => {
    setActiveTab('liked');
  };

  const handleViewDesign = (postId) => {
    navigate(`/post/${postId}`);
  };

  const displayedItems = items[activeTab] || [];

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="library-container">
      <h1>Mi biblioteca</h1>
      <div className="cuadrado">
        <button onClick={setItemsGuardados} className={activeTab === 'saved' ? 'active' : ''}>
          Guardados ({items.saved.length})
        </button>
        <button onClick={setItemsLikeados} className={activeTab === 'liked' ? 'active' : ''}>
          Likeados ({items.liked.length})
        </button>
        <div className="library-grid" key={activeTab}>
          {displayedItems.map((item, index) => (
            <div key={`${activeTab}-${item.id}-${index}`} className="library-item">
              <img src={item.front_image} alt={`Design ${item.id}`} />
              <div className="item-actions">
                <button className="edit-btn" onClick={() => handleViewDesign(item.id)}>Ver Diseño</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;