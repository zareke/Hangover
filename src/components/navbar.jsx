import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import InicioSesion from './InicioSesion';
import "./navbar.css"
import axios from 'axios';
import config from '../config';
import { AuthContext } from '../AuthContext'; // Importar el contexto de autenticación
import bag from '../vendor/imgs/bagicon.png'
import home from '../vendor/imgs/homeicon.png'
import info from '../vendor/imgs/infoicon.png'
import library from '../vendor/imgs/libraryicon.png'
//import southside from '../vendor/imgs/Sin titulowrr.png'
import southside from '../vendor/imgs/hangoverLogo2-02.png'
import southside2 from '../vendor/imgs/logo2.png'

import newdesign from '../vendor/imgs/newicon.png'
import profile from '../vendor/imgs/profileicon.png'
import { handleSearch } from '../universalhandlers';
import { useNavigate } from "react-router-dom";
import logo from "../vendor/imgs/logo.png"
import magGlass from "../vendor/imgs/magGlass.png"
import standardUser from "../vendor/imgs/standardUser.png"

let openModal, closeModal;
//hacemos una copia de hangover y ahi modificamos todo react-native o usamos todo lo original? y supongo que pushearemos otra branch buen
const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); // Obtener estado de inicio de sesión desde el contexto
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [infoPopupVisible,setInfoPopupVisible]=useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isInfoClicked, setIsInfoClicked] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(config.url + 'user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data[0]); 
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

  const openInfoThingy = () =>{
    setInfoPopupVisible(true)
    setIsInfoClicked(true)
  }
  const closeInfo = ()=>{
    setInfoPopupVisible(false)
    setIsInfoClicked(false)
  }
  
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

  const handleSubmitSearch = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    if (searchQuery) {
      navigate(`/search/${searchQuery}`); // Realiza la redirección
    }
  };

  
  return (
    <div className="headerCointain">
        
      <header className="header">


        <Link className='logoA' to="/"><img className='pagelogo' src={southside2} alt="Hangover Logo" /></Link> {/*el que haya hecho la navbar la hizo muy mal y esto se ve muy chico*/ }
        {isMenuOpen ? <nav className="verticalNav">
          <ul >
            <li><button className="hamburger" onClick={toggleMenu}>
            &#9776; {/* Hamburger icon */}
            </button></li> 
            <li><Link className='navbarBurgerElement' to="/"><img className='iconNavImage' src={home} alt="" /><span className='nombrelink'>Explorar </span> <span class="flecha">&#128898;</span></Link></li>
            <li><Link className='navbarBurgerElement' to="/informacion/legal"><img className='iconNavImage' src={info} alt="" /><span className='nombrelink'>Información</span> <span class="flecha">&#128898;</span></Link></li>
            
 {/**check if logged in */} <li><Link className='navbarBurgerElement' to={"/user/"+user.id}><img className='iconNavImage' src={profile} alt="" /><span className='nombrelink'>Perfil</span> <span class="flecha">&#128898;</span></Link></li>
            <li><Link className='navbarBurgerElement' to="/bolsa"><img className='iconNavImage' src={bag} alt="" /> <span className='nombrelink'>Bolsa</span> <span class="flecha">&#128898;</span></Link></li>
            <li> 
              {isLoggedIn ? (
                
                <Link className='navbarBurgerElement' to="/Biblioteca"><img className='iconNavImage' src={library} alt="" /> <span className='nombrelink'>Biblioteca</span></Link>
              ) : (
                <a className='navbarBurgerElement' onClick={openModal}><img className='iconNavImage' src={library} alt="" /> <span className='nombrelink'>Biblioteca</span></a>
              )}<span className="flecha">&#128898;</span>
            </li>
            <li>
              {isLoggedIn ? (
                <>
                  {user ? <Link to={"/user/"+user.id}>{user.username}</Link> : null}
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
        
       
        <nav >
          <div className='navBotonesNavbar'>
      
          <ul className="botonesNavbar">
            <li><div className="busqueda">
                <form onSubmit={handleSubmitSearch} className='searchForm'>
                  
                  <input onChange={(e) => {setSearchQuery(e.target.value);}} type="search" id="gsearch" name="gsearch" style={{ width: '400px', height: '27px' }} placeholder='Busca alguna prenda o usuario...' />
                 <div className="centrador"> <button type="submit"><img className='busquedaIcono' src={magGlass}></img></button></div>
                </form> 
              </div></li>
            <li><Link to="/chatsview">Mensajes</Link></li>
            <li><div onMouseEnter={openInfoThingy} onMouseLeave={closeInfo}> {
             infoPopupVisible  && (<div className='infoPopup'>
              <div className="compactedInfo">
            <Link to="/informacion/legal">Información legal</Link>
            <Link to="/informacion/privacidad">Información de privacidad</Link>
            <Link to="/informacion/contacto"> Contáctanos</Link>
            </div>
           </div>)
           } <a>
           Información
         </a>
         </div>
          
            </li>
            <li><Link to="/carrito">Carrito</Link></li>
            <li className='textoNuevoDiseño'><Link className='nuevoDiseño' to="/designer">Nuevo Diseño</Link></li>
            <li> 
              {isLoggedIn ? (
                <Link to="/Biblioteca">Biblioteca</Link>
              ) : (
                <a onClick={openModal}>Biblioteca</a>
              )}
            </li>
          </ul>
          </div>
          <div className='userThingsDiv'>
          {isLoggedIn ? (
                <>
                {console.log(user)}
                  {user ? <Link className='userThingsA' to={"/user/"+user.id}>{user.username}<img className='profPic' src={user.profile_photo}></img></Link> : null} 
                  {/* yo le pondria que en lugar de decir el nombre de usuario mostrara su fotito */}
                 
                </>
              ) : (
                <a className='userThingsA' onClick={openModal}><img className='profPic' src={standardUser}/></a>
              )}
        </div>
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
