import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config"


const InicioSesion = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin =async (e) => {
    e.preventDefault();

    try{
        const response = await axios.post(config.url+"user/login/",{
         
            username:username,
            password:password
          
        })
        if (response.data.success){
            localStorage.setItem("token", response.data.token);
            navigate("/");
        }
        else{
            //hacer un error o algo yo no tengo tiempo :v
        }
      }
      catch (e){
        console.error(e)
      }

  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default InicioSesion;
