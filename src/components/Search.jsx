import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import config from "../config";
import { Link } from "react-router-dom";
import Carta from "./carta";

const Search = () => {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [newSearchQuery, setNewSearchQuery] = useState('');
  const { search } = useParams();
  const navigate = useNavigate();
  const observer = useRef();

  // Función para obtener resultados de búsqueda
  const fetchResults = useCallback(async (page) => {

    if(hasMore){ // Evitar llamadas si no hay más resultados

      try {
        const response = await axios.get(`${config.url}post/search/${search}`, {
          params: {
            limit: 5,
            page: page,
          },
        });

        console.log("API Response:", response.data);

        // Filtrar resultados duplicados
        const newResults = response.data.collection.filter(newResult => {
          return !results.some(existingResult => existingResult.id === newResult.id);
        });
        console.log(newResults);

        setResults([...results, ...newResults]);
        setHasMore(response.data.pagination.nextPage !== false);
        setPage(page + 1);
      } catch (error) {
        setError("Error fetching search results");
        console.error("Error fetching search results:", error);
      }
    }
  }, [results]);

  useEffect(() => {
    fetchResults(1);
  }, []);

  const lastPostElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchResults(page);
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchResults, hasMore, page]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newSearchQuery) {
      navigate(`/search/${newSearchQuery}`);
    }
  };

  const dividedPosts = useMemo(() => {
    return results.reduce((acc, post, index) => {
      const groupIndex = index % 4;
      acc[groupIndex].push(post);
      return acc;
    }, [[], [], [], []]);
  }, [results]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
    <div className="centrador">
      <div className="wrapbusqueda">
        {results.length > 0 ? ( dividedPosts.map((group, groupIndex) => (
          <div key={groupIndex} className={`wrapbusqueda-group${groupIndex}`}>
          {group.map((post, index) => {
            const isLastPost = index === group.length - 1;
            console.log("aaaaaaaaaaaa",post)
            return (
              
              <Link
              key={post.post_id || post.id} // Prueba ambas keys
              to={`/post/${post.post_id || post.id}`}
              ref={isLastPost ? lastPostElementRef : null}
            >
              <Carta 
                putLike={true}
                className={`cardGroup${groupIndex}`} 
                post_id={post.post_id || post.id} 
                profile_photo={post.post.creator_user.profile_photo} 
                username={post.post.creator_user.username} 
                user_id={post.post.creator_user.id} 
                cloth={post.post.front_image} 
              />
            </Link>

            );
          })}
        </div>
        )) ) : (
          <p>No results found.</p>
        ) }
      </div>
    </div>
    </>
  );
};

export default memo(Search);
