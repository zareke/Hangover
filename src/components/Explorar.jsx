import React, { useState, useEffect, useCallback, useRef } from "react";
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
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${config.url}post`, {
        params: {
          limit: 10,
          page: page,
        },
        headers: { Authorization: `Bearer ${token}` },
        
      });
      setPosts((prevPosts) => [...prevPosts, ...response.data.collection]);
      setHasMore(response.data.pagination.nextPage !== null);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      setError("Error fetching posts");
      console.error("Error fetching posts:", error);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

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

  const dividedPosts = posts.reduce(
    (acc, post, index) => {
      if (index % 4 === 0) acc[0].push(post);
      else if (index % 4 === 1) acc[1].push(post);
      else if (index % 4 === 2) acc[2].push(post);
      else acc[3].push(post);
      return acc;
    },
    [[], [], [], []]
  );

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
                    <Carta className={`cardGroup${groupIndex}`} post_id={post.id} profile_photo={post.post.creator_user.profile_photo} username={post.post.creator_user.username} user_id={post.post.creator_user.id} cloth={post.post.front_image} >
                        
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

export default Explorar;
