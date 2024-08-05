import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Button from "./Button";
import config from "../config";
import { AuthContext } from "../AuthContext";
import { guardarHandler,eliminarGuardadoHandler,followHandler } from "../savehandlers";

const Profile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null); // Initialize with null
  const { isLoggedIn,openModalNavBar } = useContext(AuthContext); //i dont know que does esto asi que i dont use it you know
  const [follows,setFollows] = useState(false)


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token2 = localStorage.getItem("token") 
        const response = await axios.get(`${config.url}user/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token2}` },
        });
        console.log("Response data:", response.data);
        setUserData(response.data);
        setFollows(userData.follows)
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [userId]); // Include userId and token in dependencies

 

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
          {follows ? <Button onClick={() => followHandler(userId,setFollows,isLoggedIn,openModalNavBar)} text="Dejar de segir"/> : <Button text="Seguir"/>}
          <Button text="Mensaje" />
          <Button text="Dar Insignia" />
        </div>
      </header>
      <section className="profile-content">
        {userData.items && userData.items.map((item) => (
          <div key={item.id} className="item-card">
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Profile;
