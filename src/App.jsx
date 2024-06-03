import React, { useState } from "react";
import "./App.css";
import "./components/FilterButton.css";
import Carta from "./components/carta.jsx";

function App() {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };
  const cartas = [1,2,3,4,5]
  return (
    <div>
      <header className="header">
        <h1>hansover</h1>
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
        <button
          className={`menu__icon ${isActive ? "active" : ""}`}
          onClick={handleClick}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className="centrador">
        <div className="wrapbusqueda">
        {cartas.map((item, index) => (
                <Carta
                    key={index}
                    className={`item ${index % 2 === 0 ? 'even' : 'odd'}`}
                >
                    {item}
                </Carta>
            ))}
      </div>
      </div>
    </div>
  );
}

export default App;
