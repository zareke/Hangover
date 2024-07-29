import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Button from "./Button";
import config from "../config";
import { AuthContext } from "../AuthContext";

const Profile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState({});
  const { token } = useContext(AuthContext);
  
  useEffect(() => {
    console.log("hola?")
    const fetchUserData = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await axios.get(`${config.url}user/profile/${userId}`, {
          
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        setUserData(response.data);
        console.log("aaaa", userData);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <img src={userData.user_data.profile_photo} alt={userData.user_data.username} className="profile-pic" />
        <div className="profile-info">
          <h1>{userData.user_data.first_name}</h1>
          <p>@{userData.user_data.username}</p>
          <p>{userData.user_data.description}</p>
          <div className="profile-stats">
            <span>{userData.user_data.post_number} Prendas</span>
            <span>{userData.user_data.follower_number} Seguidores</span>
            <span>{userData.user_data.followed_number} Seguidos</span>
          </div>
        </div>
        <div className="profile-actions">
          <Button text="Seguir" />
          <Button text="Mensaje" />
          <Button text="Dar Insignia" />
        </div>
      </header>
      <section className="profile-content">
        {/*userData.items.map((item) => (
          <div key={item.id} className="item-card">
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))*/}
      </section>
    </div>
  );
};

export default Profile;
