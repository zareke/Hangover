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
    

   /* const mp = new MercadoPago("YOUR_PUBLIC_KEY", { //el pete de shebar dejo un error y se fue shebar sos alto pete dejaste un error aca y te fuiste esto es un error
        locale: "es-AR",
    });*/

    const handleCheckout = async (totalAmount) => {
        try{
        
            const orderData = {
                title: "YO",
                total_price: totalAmount
            };

            const response = await axios.post(`${config.url}payment/create_preference`, { 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            const preference = await response.json();
            createCheckoutButton(preference.id);
        } catch (error){
            alert("error :(");
        }
        /*try {
            const res = await axios.post(`${config.url}payment/create-order`);
            const data = res.data; // Axios ya parsea la respuesta JSON
            window.location.href = data.init_point;
        } catch (error) {
            console.error('Error during checkout:', error);
        }*/
    };

    const createCheckoutButton = () => {
        
    }

    return (
        <>
        <script src="https://sdk.mercadopago.com/js/v2"></script>
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
            <button id="checkout" onClick={handleCheckout(totalAmount)}>Pay</button>
            <div id="wallet_container"></div>
        </>
    );
};

export default Carrito;
