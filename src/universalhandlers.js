import axios from "axios";
import config from "./config";

export const guardarHandler = async (postId, setSaved, isLoggedIn, openModalNavBar) => {
  if (isLoggedIn) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${config.url}post/${postId}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        setSaved(true);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  } else {
    openModalNavBar();
  }
};

export const eliminarGuardadoHandler = async (postId, setSaved) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${config.url}post/${postId}/save`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 204) {
      setSaved(false);
    }
  } catch (error) {
    console.error("Error al eliminar guardado:", error);
  }
};

export const followHandler = async (userId,setFollow,isLoggedIn,openModalNavBar) => {
  if (isLoggedIn) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${config.url}user/follow/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 201) {
        setFollow(true);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  } else {
    openModalNavBar();
  }
}
export const unFollowHandler = async (userId,setFollow) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${config.url}user/follow/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200) {
      setFollow(false);
    }
  } catch (error) {
    console.error("Error al eliminar seguido:", error);
  }
}