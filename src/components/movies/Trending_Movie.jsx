import React, { useEffect, useState, useRef, useCallback } from "react";
import Card from "../Card";
import { useNavigate } from "react-router-dom";

const Toprated_Movie = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const observer = useRef();
  const MAX_PAGES = 2;


  const fetchMovies = async (pageNumber) => {
    if (pageNumber > MAX_PAGES) {
      setHasMore(false); // ✅ stop further loading
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=014463e32f320e61f3c8248c6db9ee80&page=${pageNumber}`
      );
      const data = await response.json();
  
      setMovies((prev) => [...prev, ...data.results]);
      setHasMore(data.page < data.total_pages && pageNumber < MAX_PAGES);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  // Observer for last element
  const lastMovieRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="pt-10 flex flex-wrap gap-4 ml-2">
      {movies.map((movie, index) => {
        const isLast = index === movies.length - 1;
        return (
          <div
            key={movie.id}
            onClick={() => navigate(`/player/${movie.id}`)}
            ref={isLast ? lastMovieRef : null}
          >
            <Card
              poster={movie.poster_path || null}
              title={movie.title}
              rating={movie.vote_average}
            />
          </div>
        );
      })}

      {loading && <p className="text-white text-lg text-center w-full">Loading...</p>}
    </div>
  );
};

export default Toprated_Movie;
