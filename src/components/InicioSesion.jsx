import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import "./InicioSesion.css";

const InicioSesion = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [showLoginInputs, setShowLoginInputs] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    console.log("handlelogin",username,password)
    
    try {
      const response = await axios.post(config.url + "user/login/", {
        username: username,
        password: password,
      });
      console.log(response.data)
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);

        //navigate("/");
      } else {
        // Manejar error
        alert("Error, inicio de sesion fallido, no existe el usuario o la contraseña es incorrecta");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const loadLogInInputs = () => {
    setShowLoginInputs(true);
  };

  return (
    <>
      {showPopup && (
        <div className="inicio-sesion-popup-overlay">
          <div className="inicio-sesion-popup-content">
            <button className="inicio-sesion-close-btn" onClick={closePopup}>
              &times;
            </button>
            {showLoginInputs ? (
              <form onSubmit={handleLogin}>
                <h2>Iniciar sesión</h2>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="inicio-sesion-login-btn" onClick={handleLogin}>
                  Login
                </button>
              </form>
            ) : (
              <>
                <h2>Iniciar sesión</h2>
                <button
                  className="inicio-sesion-login-btn inicio-sesion-email-btn"
                  onClick={loadLogInInputs}
                >
                  <span className="inicio-sesion-icon">@</span> Usar correo
                  electrónico
                </button>
                <button className="inicio-sesion-login-btn inicio-sesion-google-btn">
                  <span className="inicio-sesion-icon">G</span> Continuar con
                  Google
                </button>
                <button className="inicio-sesion-guest-btn" onClick={closePopup}>
                  Continuar como Invitado
                </button>
                <p className="inicio-sesion-terms">
                  Al seguir usando una cuenta en <b>Argentina</b> aceptas los{" "}
                  <a href="#">Términos de uso</a> y confirmas que has leído la{" "}
                  <a href="#">Política de privacidad</a>
                </p>
                <hr className="inicio-sesion-divider" />
                <p className="inicio-sesion-register">
                  ¿No tienes una cuenta? <a href="#">Regístrate</a>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InicioSesion;
