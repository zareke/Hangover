import React, { useState } from "react";
import "./App.css";
import "./components/FilterButton.css";
import Carta from "./components/carta.jsx";
import Navbar from "./components/navbar.jsx";


function App() {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  const cartas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const cartasImpares = cartas.filter((_, index) => index % 2 !== 0);
  const cartasPares = cartas.filter((_, index) => index % 2 === 0);

  return (
    <div>
      <Navbar></Navbar>

      <div className="botones">
        <div className="1">
          <button className="Recomendados" onclick=""><h2>Recomendados</h2></button>
        </div>
        <div className="1">
          <button className="Seguidos" onclick=""><h2>Seguidos</h2></button>
        </div>
      </div>


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
          {/* Cartas impares */}
          {/* <div className="wrapbusqueda-impar">
            {cartasImpares.map((item, index) => (
              <Carta key={index} className="cardImpar">
                {item}
              </Carta>
            ))}
          </div> */}

          {/* Cartas pares */}
          {/* <div className="wrapbusqueda-par">
            {cartasPares.map((item, index) => (
              <Carta key={index} className="cardPar">
                {item}
              </Carta>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}
export default App;