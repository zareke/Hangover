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
  return (
    <div>
      <Navbar></Navbar>
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
  <Carta key={index} className={index % 2 === 0 ? "cardPar" : "cardImpar"}>
    {item}
  </Carta>
))}

  </div>
</div>

    </div>
  );
}

export default App;