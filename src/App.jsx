import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./components/FilterButton.css";
import Navbar from "./components/navbar.jsx";
import Explorar from "./components/Explorar.jsx";
import PostDetail from "./components/postDetail.jsx"; // Import the PostDetail component
import InicioSesion from "./components/InicioSesion.jsx"

function App() {
  return (
    <Router>

      <Navbar inicioSesion={false}/>
      
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

export default App;
