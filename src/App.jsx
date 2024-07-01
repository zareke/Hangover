import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./components/FilterButton.css";
import Navbar, { openModal, closeModal } from "./components/navbar.jsx";
import Explorar from "./components/Explorar.jsx";
import PostDetail from "./components/postDetail.jsx"; // Import the PostDetail component
import InicioSesion from "./components/InicioSesion.jsx"

let isLoggedIn;

function App() {
    if(!localStorage.getItem("token")){
      localStorage.setItem("token", "");
    }
    
    isLoggedIn = () => {
      if(localStorage.getItem("token") !== ""){
        openModal();
      }//pensar como hacer is esta logueado
    }

  return (
    <Router>

      <Navbar estaIniciadoSesion={ localStorage.getItem("token") !== "" }/>
      
      <Routes>
        <Route path="/" element={<Explorar />} />
        <Route path="/login" element={<InicioSesion/>} />
        <Route path="post">
          <Route path=":postId" element={<PostDetail/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export { isLoggedIn };
export default App;
