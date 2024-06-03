import React, { useState } from 'react';
import './App.css';
import './FilterButton.css';

function App() {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div>
      <header className="header">
        <h1>hangover</h1>
        <nav>
          <ul>
            <li>
              <a href="#Sobre mí">Explorar</a>
            </li>
            <li>
              <a href="#Conocimientos">Información</a>
            </li>
            <li>
              <a href="#Experiencia">Nuevo diseño</a>
            </li>
            <li>
              <a href="#Educación">Perfil</a>
            </li>
            <li>
              <a href="#Certificaciones">Garage</a>
            </li>
            <li>
              <a href="#Contacto">Bolsa</a>
            </li>
            <li>
              <a href="#Contacto">Iniciar sesión</a>
            </li>
          </ul>
        </nav>
      </header>
      <div className="menuhamburguesa">
        <button className={`menu__icon ${isActive ? 'active' : ''}`} onClick={handleClick}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  );
}

export default App;
