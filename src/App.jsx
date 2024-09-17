import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./components/FilterButton.css";
import Navbar, { openModal } from "./components/navbar.jsx";
import Explorar from "./components/Explorar.jsx";
import PostDetail from "./components/postDetail.jsx"; // Import the PostDetail component
import InicioSesion from "./components/InicioSesion.jsx";
import Biblioteca from "./components/Biblioteca.jsx";
import Informacion from "./components/Informacion.jsx"
import Profile from "./components/Profile.jsx"
import Bolsa from "./components/Bolsa.jsx"
import Designer from "./components/designer.jsx";
import Search from "./components/Search.jsx";
import Chat from "./components/Chat.jsx";

import { AuthProvider } from "./AuthContext";

function App() {

  return (
    <AuthProvider>
        <Router>
            <Navbar />
            <Routes>
                <Route exact path ="/informacion/:tema" element={<Informacion/>}/>
                <Route exact path="/" element={<Explorar />} />
                <Route exact path="/login" element={<InicioSesion />} />
                <Route exact path="post">
                    <Route exact path=":postId" element={<PostDetail />} />
                </Route>
                <Route exact path="user">
                    <Route exact path=":userId" element={<Profile/>}/>
                </Route>
                <Route path="/designer" element={<Designer/>} />
                <Route exact path="bolsa" element={<Bolsa/>}></Route>
                <Route exact path="/biblioteca" element={<Biblioteca />} />
                <Route exact path="/search">
                     <Route exact path=":search" element={<Search/>}/> 
                </Route>
                <Route exact path="privateChat/:ownId/:userId" element={<Chat/>}></Route>
            </Routes>   
        </Router>
    </AuthProvider>
);
}

export default App;
