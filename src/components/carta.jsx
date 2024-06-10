import "./carta.css";
import remerita from "../vendor/imgs/remeraplaceholder.png";
import fotito from "../vendor/imgs/placeholderpic.jfif";

function Carta({ className }) {
  return (
    <div className={`card ${className}`}>
      <div className="guardador">
        <div className="description">
          <img className="profpic" src={fotito} alt="fotito" />
          <span>@ElUsuario</span>
        </div>
        <button className="Guardar">Guardar</button>
      </div>
      <div className="content">
        <img className="remerita" src={remerita} alt="remerita" />
      </div>
    </div>
  );
}

export default Carta;