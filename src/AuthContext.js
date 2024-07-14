import React, { createContext, useState, useEffect } from 'react';
import { openModal } from './components/navbar';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            localStorage.setItem("token", "");
        } else if (token !== "") {
            setIsLoggedIn(true);
        }
    }, []);

    const openModalNavBar = () => {
        if (!isLoggedIn) {
            // Define openModal here or import it if it's defined elsewhere
            openModal();
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, openModalNavBar }}>
            {children}
        </AuthContext.Provider>
    );
};
