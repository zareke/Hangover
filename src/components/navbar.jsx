import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import InicioSesion from './InicioSesion'; // Asegúrate de importar el componente de inicio de sesión si es necesario
import axios from "axios";
import config from "../config";

const Navbar = ({ estaIniciadoSesion }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);

  // Función para abrir el modal
  const openModal = () => {
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
  };

  const LogOut = () => {
    localStorage.setItem("token", "");
    setUser(null); // Clear user state on logout
  };

  useEffect(() => {
    if (estaIniciadoSesion) {
      const fetchUser = async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get(config.url + "user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data); // Assuming user data is in response.data
      };

      fetchUser();
    }
  }, [estaIniciadoSesion]);

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
              {estaIniciadoSesion && user ? (
                <a href="#Perfil">{user.username}</a> // Adjust according to the actual user data structure
              ) : (
                <a onClick={openModal}>Iniciar sesión</a>
              )}
            </li>
            <li><button onClick={LogOut}>cerrar sesion</button></li>
          </ul>
        </nav>
      </header>

      {/* Modal */}
      {modalVisible && (
        <div id="myModal">
          <InicioSesion closeModal={closeModal} /> {/* Ensure closeModal is passed as a prop if needed */}
        </div>
      )}
    </div>
  );
};

export default Navbar;

