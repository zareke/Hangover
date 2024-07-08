import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./components/FilterButton.css";
import Navbar, { openModal } from "./components/navbar.jsx";
import Explorar from "./components/Explorar.jsx";
import PostDetail from "./components/postDetail.jsx"; // Import the PostDetail component
import InicioSesion from "./components/InicioSesion.jsx";
import Biblioteca from "./components/Biblioteca.jsx";
import { AuthProvider } from "./AuthContext";

function App() {

  return (
    <AuthProvider>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Explorar />} />
                <Route path="/login" element={<InicioSesion />} />
                <Route path="post">
                    <Route path=":postId" element={<PostDetail />} />
                </Route>
                <Route path="/biblioteca" element={<Biblioteca />} />
            </Routes>
        </Router>
    </AuthProvider>
);
}

export default App;
