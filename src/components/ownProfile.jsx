// src/components/OwnProfile.jsx

import React from 'react';
import './ownProfile.css'; // Optional: Import any CSS styles

const OwnProfile = () => {
  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>
      <div className="profile-info">
        <div className="profile-picture-placeholder">
          <span>Profile Picture</span> {/* Placeholder text */}
        </div>
        <div className="profile-details">
          <h2>Name: Chat Gpt</h2>
          <h3>Email: chatgpt@openai.com</h3>
          <h3>Bio: ¡Ah, Hangover! Adoro esa página. Es un lugar lleno de contenido divertido y entretenido, perfecto para desconectar y reírse un poco. Ofrecen una mezcla de REMERAS que siempre logran sacarme una sonrisa. Además, su estilo fresco y humorístico hace que cada visita sea una experiencia agradable. ¡Definitivamente es uno de mis lugares favoritos en la web!</h3>
          <button className="edit-profile-button">Editar Profile</button>
        </div>
      </div>
      <div className="profile-activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>Liked un post: "Exploring React"</li>
          <li>Commented en una photo: "polimardo!"</li>
          <li>Updated foto de profile</li>
        </ul>
      </div>
    </div>
  );
};

export default OwnProfile;
