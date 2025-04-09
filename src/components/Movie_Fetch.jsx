import React, { useEffect, useState, useRef, useCallback } from "react";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

const Movie_Fetch = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef();
  const navigate = useNavigate();
  const MAX_PAGES = 2;

  const fetchMovies = async (pageNumber) => {
    if (pageNumber > MAX_PAGES) {
      setHasMore(false);
      return;
    }

    setLoading(true);
    try {
      const apiKey = "014463e32f320e61f3c8248c6db9ee80";
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${pageNumber}`;

      const response = await fetch(url);
      const data = await response.json();

      setMovies((prev) => [...prev, ...data.results]);
      if (data.page >= data.total_pages || pageNumber >= MAX_PAGES) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const observerCallback = useCallback((node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="">
      <span className="absolute ml-3 mt-3 text-xl">{`${movies.length}`} Results</span>

      <div className="mr-0.5 pt-15 flex flex-wrap gap-4 max-md:gap-3.5 justify-center items-center">
        {movies.map((movie, index) => {
          if (index === movies.length - 1) {
            // last movie triggers next page load
            return (
              <div
                ref={observerCallback}
                key={movie.id}
                onClick={() => navigate(`/player/${movie.id}`)}
              >
                <Card
                  poster={movie.poster_path}
                  title={movie.title}
                  rating={movie.vote_average}
                />
              </div>
            );
          } else {
            return (
              <div key={movie.id} onClick={() => navigate(`/player/${movie.id}`)}>
                <Card
                  poster={movie.poster_path}
                  title={movie.title}
                  rating={movie.vote_average}
                />
              </div>
            );
          }
        })}
      </div>

      {loading && <p className="text-center text-gray-400 mt-5">Loading...</p>}
    </div>
  );
};

export default Movie_Fetch;
