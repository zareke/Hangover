import axios from 'axios';
import config from "../config.js";
import React, { useState, useEffect } from 'react';

const Carrito = () => {
    const [carritoStuff, setCarritoStuff] = useState([]);
    const [error, setError] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const loadCarrito = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${config.url}user/carrito`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data && typeof response.data === 'object') {
                    if (Array.isArray(response.data.carritoStuff)) {
                        setCarritoStuff(response.data.carritoStuff);
                    } else {
                        setError("API response format is incorrect");
                        console.error("Incorrect data format:", response.data);
                    }
                } else {
                    setError("Invalid API response");
                    console.error("Invalid response:", response.data);
                }
            } catch (error) {
                setError("Error fetching items");
                console.error('Error fetching items', error);
            }
        };
        loadCarrito();
    }, []);

    useEffect(() => {
       let totalPrice = 0;
        carritoStuff.forEach(element => {
            totalPrice += parseFloat(element.quantity * element.price);
        });
        setTotalAmount(totalPrice);
        
    }, [carritoStuff]);

    const handleCheckout = async () => {
        try {
            const res = await axios.post(`${config.url}payment/create-order`);
            const data = res.data; // Axios ya parsea la respuesta JSON
            window.location.href = data.init_point;
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <>
            {error && <p>{error}</p>}
            {console.log(carritoStuff)}
            {carritoStuff && carritoStuff.map((item, index) => (
                <div key={index}>
                    <h3>{index}</h3>
                    <img src={item.front_image} alt={`Product ${index}`} width="100px" height="auto"/>
                    <ul>
                        <li>Precio unitario: {item.price}</li>
                        <li>Cantidad: {item.quantity}</li>
                        <li>Precio total: {item.price * item.quantity}</li>
                    </ul>
                </div>
            ))}
            <h3>Precio total del carrito: {totalAmount}</h3>
            <button id="checkout" onClick={handleCheckout}>Pay</button>
        </>
    );
};

export default Carrito;
