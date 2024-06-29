import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Carta from "./carta.jsx";


const Explorar = () => {
  const [isActive, setIsActive] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3508/post', {
          params: {
            limit: 10,
            page: 1,
          },
        });
        setPosts(response.data.collection);
        console.log("posts",posts)
      } catch (error) {
        setError('Error fetching posts');
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

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

                return (  
                  <Link key={post.id} to={`/post/${post.id}`}>
                    <Carta className={`cardGroup${groupIndex}`}>
                      {post.post.front_image}
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
