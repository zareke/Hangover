import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import InicioSesion from './InicioSesion';
import axios from 'axios';
import config from '../config';
import { AuthContext } from '../AuthContext'; // Importar el contexto de autenticación

let openModal, closeModal;

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); // Obtener estado de inicio de sesión desde el contexto
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(config.url + 'user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data); // Suponiendo que los datos del usuario están en response.data
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (isLoggedIn) {
      fetchUser();
    }
  }, [isLoggedIn]);

  openModal = () => {
    setModalVisible(true);
  };

  closeModal = () => {
    setModalVisible(false);
  };

  const LogOut = () => {
    localStorage.setItem('token', '');
    setUser(null);
    setIsLoggedIn(false); // Actualizar estado de inicio de sesión en el contexto
    window.location.reload(); // Recargar la página para limpiar el estado
  };

  return (
    <div>
      <header className="header">
        <h1>hansover</h1>
        <nav>
          <ul className="botonesNavbar">
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
            <li>
              {isLoggedIn ? (
                <Link to="/Biblioteca">Biblioteca</Link>
              ) : (
                <a onClick={openModal}>Biblioteca</a>
              )}
            </li>
            <li>
              {isLoggedIn ? (
                <>
                  {user ? <a href="#Perfil">{user.id}</a> : null}
                  <button onClick={LogOut}>Cerrar sesión</button>
                </>
              ) : (
                <a onClick={openModal}>Iniciar sesión</a>
              )}
            </li>
          </ul>
        </nav>
      </header>

      {/* Renderizar el componente de inicio de sesión si modalVisible es true */}
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
