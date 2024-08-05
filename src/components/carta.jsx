import "./carta.css";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { guardarHandler, eliminarGuardadoHandler } from "../universalhandlers.js";

function Carta({ className, profile_photo, username, user_id, cloth, post_id }) {
  const { isLoggedIn, openModalNavBar } = useContext(AuthContext);
  const [saved, setSaved] = useState(false);

  return (
    <div className={`card ${className}`}>
      <div className="guardador">
        <Link className="description" to={`/user/${user_id}`}>
          <img className="profpic" src={profile_photo} alt="Foto de perfil" />
          <span className="user">{username}</span>
        </Link>
        {saved ? (
          <Link className="Guardado" onClick={() => eliminarGuardadoHandler(post_id, setSaved)}>
            Guardado
          </Link>
        ) : (
          <Link className="Guardar" onClick={(e) => {
            e.preventDefault();
            guardarHandler(post_id, setSaved, isLoggedIn, openModalNavBar);
          }}>
            Guardar
          </Link>
        )}
      </div>
      <div className="content">
        <img className="remerita" src={cloth} alt="Ropa" />
      </div>
    </div>
  );
}

export default Carta;
