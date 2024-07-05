import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import InicioSesion from './InicioSesion';
import axios from "axios";
import config from "../config";

let openModal, closeModal;

const Navbar = ({ estaIniciadoSesion }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(config.url + "user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data); // Assuming user data is in response.data
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (estaIniciadoSesion) {
      fetchUser();
    }
  }, [estaIniciadoSesion]);

  openModal = () => {
    setModalVisible(true);
  };

  closeModal = () => {
    setModalVisible(false);
  };

  const LogOut = () => {
    localStorage.setItem("token", "");
    setUser(null);
    window.location.reload();
  };

  return (
    <div>
      <header className="header">
        <h1>hansover</h1>
        <nav>
          <ul className="botonesNavbar">
            <li><Link to="/">Explorar</Link></li>
            <li>
              <div className="busqueda">
                <form>
                  <input type="search" id="gsearch" name="gsearch" style={{ width: '300px' }} />
                </form>
              </div>
            </li>
            <li><a href="#Info">Información</a></li>
            <li><a href="#NewDesign">Nuevo diseño</a></li>
            <li><a href="#Perfil">Perfil</a></li>
            <li><a href="#Bolsa">Bolsa</a></li>
            <li>{estaIniciadoSesion ? (<Link to="/Biblioteca">Biblioteca</Link>) : (<a onClick={openModal}>Biblioteca</a>)} </li>
            <li>
              {estaIniciadoSesion ?
              (
                user ? <a href="#Perfil">{user.id}</a> : null,
                (<button onClick={LogOut}>Cerrar sesión</button>)
              ) : (
                <a onClick={openModal}>Iniciar sesión</a>
              )}
            </li>
          </ul>
        </nav>
      </header>

      {modalVisible && (
        <div id="myModal">
          <InicioSesion closeModal={closeModal} />
        </div>
      )}
    </div>
  );
};

export { openModal, closeModal };

export default Navbar;


