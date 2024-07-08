import "./carta.css";
//import remerita from "../vendor/imgs/remeraplaceholder.png";
//import fotito from "../vendor/imgs/placeholderpic.jfif";
import isLoggedIn from "../App.jsx";

function Carta({ className, profile_photo, username, cloth }) {
  return (
    <div className={`card ${className}`}>
      <div className="guardador">
        <div className="description">
          <img className="profpic" src={profile_photo} alt="fotito" />
          <span className="user">{username}</span>
        </div>
        <button className="Guardar" onClick={isLoggedIn}>Guardar</button>
      </div>
      <div className="content">
        <img className="remerita" src={cloth} alt="remerita" />
      </div>
    </div>
  );
}

export default Carta;