import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import InicioSesion from './InicioSesion';
import "./navbar.css"
import axios from 'axios';
import config from '../config';
import { AuthContext } from '../AuthContext'; // Importar el contexto de autenticación

let openModal, closeModal;
//hacemos una copia de hangover y ahi modificamos todo react-native o usamos todo lo original? y supongo que pushearemos otra branch buen
const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); // Obtener estado de inicio de sesión desde el contexto
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu open/close
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = 'unset'; // Re-enable scrolling
    }
  };
  
  const LogOut = () => {
    localStorage.setItem('token', '');
    setUser(null);
    setIsLoggedIn(false); // Actualizar estado de inicio de sesión en el contexto
    window.location.reload(); // Recargar la página para limpiar el estado
  };

  
  useEffect(() => {
    console.log("holaaaaa");

    // Selecciona el elemento a observar
    const element = document.querySelector('.verticalNav');

    if (element) {
      // Función que se llama cuando se detectan cambios
      const handleMutation = () => {
        const isDisplayNone = window.getComputedStyle(element).display === 'none';
        console.log("holaaax2");
        setIsMenuOpen(!isDisplayNone);
      };

      // Crea un nuevo observer
      const observer = new MutationObserver(() => {
        handleMutation();
      });

      // Configura el observer para observar cambios en los atributos del elemento
      observer.observe(element, { attributes: true });

      // Llama a handleMutation para establecer el estado inicial
      handleMutation();

      // Limpia el observer cuando el componente se desmonta
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div>
      <header className="header">
        <h1 id="titleMain"><Link to="/">hgvr</Link></h1>
        {isMenuOpen ? <nav class="verticalNav">
          <ul>
            <li><button className="hamburger" onClick={toggleMenu}>
            &#9776; {/* Hamburger icon */}
            </button></li>
            <li><Link to="/">Explorar</Link></li>
            <li><Link to="/informacion">Información</Link></li>
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
            {/* *boton imaginario que tiene un icono buscar y que busca* */}
            
          </ul>
        </nav> 
        :
        <button className="hamburger" onClick={toggleMenu}>
          &#9776; {/* Hamburger icon */}
        </button>}
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
            <li><Link to="/informacion">Información</Link></li>
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
