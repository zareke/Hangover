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
