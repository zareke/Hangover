import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import "./InicioSesion.css";


const InicioSesion = ({ closeModal }) => {
  const [showPopup, setShowPopup] = useState(true);
  const [showLoginInputs, setShowLoginInputs] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [description, setDescription] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [roleId, setRoleId] = useState(2); // Assuming 2 is the default role ID for new users
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(config.url + "user/login/", {
        username,
        password,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        closePopup();
        window.location.reload();
      } else {
        // Handle error
      }
    } catch (e) {
      if (e.response && e.response.status === 404) {
        window.confirm(
          "Error, inicio de sesión fallido, no existe el usuario o la contraseña es incorrecta"
        );
      } else {
        console.error(e);
      }
    }
  };

  const   handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(config.url + "/user/register", {
        username,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        date_of_birth: dateOfBirth,
        description,
        profile_photo: profilePhoto,
        role_id: roleId,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        closePopup();
        window.location.reload();
      } else {
        window.confirm(response.data.message || "Registro fallido");
      }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        const errorMessage = e.response.data.mensaje || "Error en los campos del registro.";
        window.confirm(errorMessage);
      } else {
        console.error(e);
      }
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    closeModal();
  };

  const loadLogInInputs = () => {
    setShowLoginInputs(true);
  };

  const toggleRegistering = () => {
    setIsRegistering(true);
  };

  return (
    <>
      {showPopup && (
        <div className="inicio-sesion-popup-overlay">
          <div className="inicio-sesion-popup-content">
            <button className="inicio-sesion-close-btn" onClick={closePopup}>
              &times;
            </button>

            {isRegistering ? (
              <form onSubmit={handleRegister}>
                <div className="inicioHeader">Registrarse</div>
                <div className="form-group">
                  <label htmlFor="username">Nombre de usuario</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="firstName">Nombre</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Apellido</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Fecha de nacimiento</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="profilePhoto">Foto de perfil (URL)</label>
                  <input
                    type="text"
                    id="profilePhoto"
                    value={profilePhoto}
                    onChange={(e) => setProfilePhoto(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="inicio-sesion-btn inicio-sesion-btn-register"
                  onClick={handleRegister}
                >
                  Registrarse
                </button>
              </form>
            ) : showLoginInputs ? (
              <form onSubmit={handleLogin}>
                <div className="inicioHeader">Iniciar sesión</div>
                <div className="form-group">
                  <label htmlFor="username">
                    Correo electrónico o nombre de usuario
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="example@ie.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <a href="#" className="inicio-sesion-forgot-password">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <button
                  type="submit"
                  className="inicio-sesion-btn inicio-sesion-btn-login"
                >
                  Iniciar sesión
                </button>
              </form>
            ) : (
              <>
                <div className="inicioHeader">Iniciar sesión</div>
                <button
                  className="inicio-sesion-btn inicio-sesion-btn-email"
                  onClick={loadLogInInputs}
                >
                  <span className="inicio-sesion-icon">@</span> Usar correo
                  electrónico
                </button>
                <button className="inicio-sesion-btn inicio-sesion-btn-google">
                  <span className="inicio-sesion-icon">G</span> Continuar con
                  Google
                </button>
                <button
                  className="inicio-sesion-btn inicio-sesion-btn-guest"
                  onClick={closePopup}
                >
                  Continuar como Invitado
                </button>
              </>
            )}
            <p className="inicio-sesion-terms">
              Al seguir usando una cuenta en <b>Argentina</b> aceptas los{" "}
              <a href="#">Términos de uso</a> y confirmas que has leído la{" "}
              <a href="#">Política de privacidad</a>
            </p>
            <hr className="inicio-sesion-divider" />
            {!isRegistering && (
              <p className="inicio-sesion-register">
                ¿No tienes una cuenta?{" "}
                <a href="#" onClick={toggleRegistering}>
                  Regístrate
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InicioSesion;
