import "./carta.css";
import { Link } from "react-router-dom";
import config from "../config.js";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../AuthContext"; // Asegúrate de importar AuthContext y useContext

function Carta({ className, profile_photo, username, user_id, cloth, post_id }) {
  const { isLoggedIn, openModalNavBar } = useContext(AuthContext); // Obtén isLoggedIn y openModalNavBar del contexto

  const guardarHandler = async (event) => {
    if (isLoggedIn) {
      
      try {
        const token = localStorage.getItem("token");
        await axios.post(`${config.url}post/${post_id}/save`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Manejar la respuesta si es necesario
      } catch (error) {
        console.error("Error al guardar:", error);
      }
    } else {
      openModalNavBar(); // Llama a openModalNavBar si el usuario no está autenticado
    }
    event.preventDefault();
  }

  return (
    <div className={`card ${className}`}>
      <div className="guardador">
        <Link className="description" to={`/user/${user_id}`}>
          <img className="profpic" src={profile_photo} alt="Foto de perfil" />
          <span className="user">{username}</span>
        </Link>
        <button className="Guardar" onClick={guardarHandler}>Guardar</button>
      </div>
      <div className="content">
        <img className="remerita" src={cloth} alt="Ropa" />
      </div>
    </div>
  );
}

export default Carta;
