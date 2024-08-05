import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config';

const Chat = () => {
  const { ownId, userId } = useParams();

  useEffect(() => {
    // Construye la URL del HTML basado en los parámetros
    const chatUrl = `${config.url}/privateChat/${ownId}/${userId}`;
    // Redirige a la URL del HTML
    window.location.href = chatUrl;
  }, [ownId, userId]);

  return <div>Redirigiendo...</div>;
};

export default Chat;
