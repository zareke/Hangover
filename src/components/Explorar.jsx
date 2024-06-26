import React, { useState } from "react";
import { Link } from "react-router-dom";
import Carta from "./carta.jsx";
//import "./Explorar.css"; // If you have specific styles for Explorar

const Explorar = () => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  const cartas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const cartasImpares = cartas.filter((_, index) => index % 2 !== 0);
  const cartasPares = cartas.filter((_, index) => index % 2 === 0);

  return (
    <div>
      <div className="botones">
        <div className="wrapper1">
          <div className="wrapper2">
            <button className="Recomendados" onClick="">
              <h2>Recomendados</h2>
            </button>
          </div>
        </div>
        <div className="wrapper1">
          <div className="wrapper2">
            <button className="Seguidos" onClick="">
              <h2>Seguidos</h2>
            </button>
          </div>
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
          <div className="wrapbusqueda-impar">
            {cartasImpares.map((item, index) => (
              <Link key={index} to={`/post/${index + 1}`}>
                <Carta className="cardImpar">{1}</Carta> 
              </Link>
            ))}ESTA CARTA
          </div>

          <div className="wrapbusqueda-par">
            {cartasPares.map((item, index) => (
              <Link key={index} to={`/post/${index + 1}`}>
                <Carta className="cardPar">{item}</Carta>
              </Link>
            ))}
          </div>

          <div className="wrapbusqueda-impar">
            {cartasImpares.map((item, index) => (
              <Link key={index} to={`/post/${index + 1}`}>
                <Carta className="cardImpar">{item}</Carta>
              </Link>
            ))}
          </div>

          <div className="wrapbusqueda-par">
            {cartasPares.map((item, index) => (
              <Link key={index} to={`/post/${index + 1}`}>
                <Carta className="cardPar">{item}</Carta>
              </Link>
            ))}
          </div>

          <div className="wrapbusqueda-impar">
            {cartasImpares.map((item, index) => (
              <Link key={index} to={`/post/${index + 1}`}>
                <Carta className="cardImpar">{item}</Carta>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorar;
