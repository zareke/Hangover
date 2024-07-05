import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Biblioteca.css'; 
import axios from 'axios';
import config from '../config';

const LibraryPage = () => {
  const [displayedItems, setDisplayedItems] = useState([]);
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Fetch items from the API when the component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(config.url + 'user/library', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response);
        setItems(response.data);
        setDisplayedItems(response.data.liked); // Initially display liked items
      } catch (error) {
        console.error('Error fetching items', error);
      }
    };

    fetchItems();
  }, []);

  // Function to display saved items
  const setItemsGuardados = () => {
    setDisplayedItems(items.saved);
  };

  // Function to display liked items
  const setItemsLikeados = () => {
    setDisplayedItems(items.liked);
  };

  // Function to handle the click on the "Ver Diseño" button
  const handleViewDesign = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="library-container">
      <h1>Mi biblioteca</h1>
      <button onClick={setItemsGuardados}>guardados</button>
      <button onClick={setItemsLikeados}>likeados</button>
      <div className="library-grid">
        {displayedItems.map(item => (
          <div key={item.id} className="library-item">
            <img src={item.front_image} alt="imagen" />
            <div className="item-actions">
              <button className="edit-btn" onClick={() => handleViewDesign(item.id)}>Ver Diseño</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;
