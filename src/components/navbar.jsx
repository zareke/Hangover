import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import InicioSesion from './InicioSesion';
import axios from "axios";
import config from "../config";

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

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const LogOut = () => {

    localStorage.setItem("token", "");
    setUser(null);
  };

  return (
    <div>
      <header className="header">
        <h1>hansover</h1>
        <nav>
          <ul className="botonesNavbar">
            <li><a href="#Explorar">Explorar</a></li>
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
            <li><a href="#Biblioteca">Biblioteca</a></li>
            <li>
              {estaIniciadoSesion ?
              (
                user ? <a href="#Perfil">{user.id}</a> : null
              ) : (
                <a onClick={openModal}>Iniciar sesión</a>
              )}
            </li>
            <li><button onClick={LogOut}>Cerrar sesión</button></li>
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

export default Navbar;
