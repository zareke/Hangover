import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import config from "../config";

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
    if (!hasMore) return; // Evitar llamadas si no hay más resultados

    try {
      const response = await axios.get(`${config.url}post/search/${search}`, {
        params: {
          limit: 20,
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
    } catch (error) {
      setError("Error fetching search results");
      console.error("Error fetching search results:", error);
    }
  }, [search, results, hasMore]);

  // Efecto para obtener los resultados iniciales al cambiar la búsqueda
  useEffect(() => {
    setResults([]); // Limpiar los resultados cuando cambia la búsqueda
    setPage(1); // Reiniciar la página a 1
    setHasMore(true); // Asegurarse de que hay más resultados disponibles
    fetchResults(1); // Obtener los primeros resultados
  }, [search]); // Dependencias limitadas

  // Efecto para manejar el observador de intersección
  useEffect(() => {
    const handleScroll = (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchResults(page);
      }
    };

    const observerInstance = new IntersectionObserver(handleScroll, { threshold: 1.0 });

    // Seleccionar el último elemento para el observador
    const lastResultElement = document.querySelector('[data-last-result]');
    if (lastResultElement) observerInstance.observe(lastResultElement);
    console.log(lastResultElement);
    return () => {
      if (lastResultElement) observerInstance.unobserve(lastResultElement);
    };
  }, [fetchResults]); // Dependencias limitadas

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newSearchQuery) {
      navigate(`/search/${newSearchQuery}`);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newSearchQuery}
          onChange={(e) => setNewSearchQuery(e.target.value)}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {results.length > 0 ? (
          results.map((result, index) => {
            const isLastResult = index === results.length - 1;
            return (
              <div
                key={result.id}
                data-last-result={isLastResult ? true : false} // Añadir atributo para seleccionar el último elemento
              >
                <h3>{result.title}</h3>
                <p>{result.description}</p>
              </div>
            );
          })
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </>
  );
};

export default Search;
