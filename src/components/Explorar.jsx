import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Carta from "./carta.jsx";
import config from "../config"

const Explorar = () => {
  const [isActive, setIsActive] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const fetchPosts = useCallback(async (page) => {
    if(hasMore){
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${config.url}post`, { //trae todos los posts sin importar visibilidad creo
          params: {
            limit: 10,
            page: page,
          },
          headers: { Authorization: `Bearer ${token}` },
          
        });
        // Filtrar nuevos posts para evitar duplicados
        const newPosts = response.data.collection.filter(newPost => {
          // Verificar si el nuevo post no está presente en posts
          return !posts.some(existingPost => existingPost.id === newPost.id);
        });



        setPosts([...posts, ...newPosts]); // Agregar solo nuevos posts
        
        setHasMore(response.data.pagination.nextPage !== false);
        setPage(page + 1);
      } catch (error) {
        setError("Error fetching posts");
        console.error("Error fetching posts:", error);
      }
    }
    
  }, [posts]);

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const lastPostElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts(page);
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchPosts, hasMore, page]
  );

  const handleClick = () => {
    setIsActive(!isActive);
  };

  const dividedPosts = useMemo(() => {
    return posts.reduce((acc, post, index) => {
      const groupIndex = index % 4;
      acc[groupIndex].push(post);
      return acc;
    }, [[], [], [], []]);
  }, [posts]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="botones">
        <div className="wrapper1">
          <div className="wrapper2">
            <button className="Recomendados" onClick="">
              <h2>Recomendados</h2>
            </button>
          </div>
        </div>
        <div className="wrapper1">
          <div className="wrapper2">
            <button className="Seguidos" onClick="">
              <h2>Seguidos</h2>
            </button>
          </div>
        </div>
      </div>

      <div className="menuhamburguesa">
        <button
          className={`menu__icon ${isActive ? "active" : ""}`}
          onClick={handleClick}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className="centrador">
        <div className="wrapbusqueda"> 
          {dividedPosts.map((group, groupIndex) => (
            <div key={groupIndex} className={`wrapbusqueda-group${groupIndex}`}>
              {group.map((post, index) => {
                const isLastPost = index === group.length - 1;
                return (
                      <Link
                        key={post.id}
                        to={`/post/${post.id}`}
                        ref={isLastPost ? lastPostElementRef : null}
                      >
                    <Carta putLike={true}className={`cardGroup${groupIndex}`} post_id={post.id} profile_photo={post.post.creator_user.profile_photo} username={post.post.creator_user.username} user_id={post.post.creator_user.id} cloth={post.post.front_image} >
                        
                    </Carta>
                    </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Explorar);
