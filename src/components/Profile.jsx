import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Button from "./Button";
import config from "../config";
import { AuthContext } from "../AuthContext";
import "./Profile.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { guardarHandler, eliminarGuardadoHandler, followHandler, unFollowHandler } from "../universalhandlers";
import Carta from "./carta.jsx";


const Profile = () => {
  const { userId } = useParams();
  const [ownUserId, setOwnUserId] = useState(null);
  const [userData, setUserData] = useState(null); // Initialize with null
  const { isLoggedIn, openModalNavBar,strictCheckAuth } = useContext(AuthContext); 
  const [follows, setFollows] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name:"",
    username: "",
    description: "",
  });

  useEffect(() => {
    let authcheck;const checkauth = async () => {return strictCheckAuth(navigate)};checkauth()
    
  },[])
  useEffect(() => {
    

    const fetchUserData = async () => {
      try {
        const token2 = localStorage.getItem("token");
        if(isLoggedIn){
          const checkisloggedinuser = await axios.get(`${config.url}user/`, {
            headers: { Authorization: `Bearer ${token2}` },
          });
          console.log(checkisloggedinuser.data[0]);
          
            setIsOwnProfile(checkisloggedinuser.data[0].id == userId);

            if(checkisloggedinuser.data[0].id !== null){
              setOwnUserId(checkisloggedinuser.data[0].id);
            }
            
        }
        

        const response = await axios.get(`${config.url}user/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token2}` },
        });
        setUserData(response.data);
        setFollows(response.data.follows);

        // Set form data to the user's current data
        setFormData({
          first_name: response.data.user_data.first_name,
          last_name:response.data.user_data.last_name,
          username: response.data.user_data.username,
          description: response.data.user_data.description,
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${config.url}user/simple`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh the user data after saving
      setUserData({
        ...userData,
        user_data: { ...userData.user_data, ...formData },
      });
      setEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error saving user data", error);
    }
  };

  const loadChat = async () => {
    try{
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${config.url}chat/get/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/privateChat/${ownUserId}/${response.data}`);
    }
    catch(error){
      console.error(error);
    }
    
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={userData.user_data.profile_photo}
          alt={userData.user_data.username}
          className="profile-pic"
        />
        <div className="profile-info">
          {editing ? (
            <>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Nombre"
              />

              <input type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Apellido"/>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="@Usuario"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descripción"
              />
              <Button text="Guardar" onClick={handleSave} />
              <Button text="Cancelar" onClick={() => setEditing(false)} />
            </>
          ) : (
            <>
              <h1>{userData.user_data.first_name}</h1>
              <p>@{userData.user_data.username}</p>
              <p>{userData.user_data.description}</p>
            </>
          )}

          <div className="profile-stats">
            <span>{userData.user_data.post_number} Prendas</span>
            <span>{userData.user_data.follower_number} Seguidores</span>
            <span>{userData.user_data.followed_number} Seguidos</span>
          </div>
        </div>
        <div className="profile-actions">
          {isOwnProfile ? (
            <>
              <Button text="Editar Perfil" onClick={() => setEditing(true)} />
              <Button text="Configuración" />
            </>
          ) : (
            <>
              {follows ? (
                <Button
                  onClick={() => unFollowHandler(userId, setFollows,setUserData)}
                  text="Dejar de seguir"
                />
              ) : (
                <Button
                  text="Seguir"
                  onClick={() =>
                    followHandler(userId, setFollows, isLoggedIn, openModalNavBar, setUserData)
                  }
                />
              )}
              <Button onClick={async (e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                openModalNavBar();
              }
              else{
                await loadChat();
              }
                }} text="Mensaje"/>
              <Button text="Dar Insignia" />
            </>
          )}
        </div>
      </div>
      <section className="profile-content">
        <div className="columns">
          {userData.posts !== null
            ? userData.posts.map((item) => (
              <Link
              to={`/post/${item.id}`}
              >
                <Carta
                  key={item.id}
                  post_id={item.id}
                  cloth={item.image}
                  profile_photo={userData.user_data.profile_photo}
                  username={userData.user_data.username}
                  user_id={userData.user_data.id}
                  putLike={true}
                  className="profile-post"
                />
                </Link>
            ))
          : null}
          </div>
      </section>
    </div>
  );
};

export default Profile;
