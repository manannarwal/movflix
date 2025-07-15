import React, { useEffect, useState, useRef, useCallback } from "react";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

const Toprated_Movie = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const observer = useRef();
  const MAX_PAGES = 2;

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="w-52 h-72 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 animate-pulse border border-white/10">
      <div className="w-full h-48 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-t-2xl"></div>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-700/60 rounded-lg w-3/4"></div>
        <div className="h-3 bg-gray-700/40 rounded-lg w-1/2"></div>
      </div>
    </div>
  );

  const fetchMovies = async (pageNumber) => {
    if (pageNumber > MAX_PAGES) {
      setHasMore(false);
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=014463e32f320e61f3c8248c6db9ee80&page=${pageNumber}`
      );
      const data = await response.json();
  
      setMovies((prev) => [...prev, ...data.results]);
      setHasMore(data.page < data.total_pages && pageNumber < MAX_PAGES);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
    setInitialLoading(false);
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
    <div className="pt-15 flex flex-wrap gap-4 pl-2">
      {/* Initial loading skeleton */}
      {initialLoading && (
        <>
          {[...Array(8)].map((_, index) => (
            <div 
              key={`skeleton-${index}`}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
              }}
            >
              <SkeletonCard />
            </div>
          ))}
        </>
      )}

      {/* Actual movie cards */}
      {!initialLoading && movies.map((movie, index) => {
        const isLast = index === movies.length - 1;
        return (
          <div
            key={movie.id}
            className="transform transition-all duration-300 hover:scale-105"
            onClick={() => navigate(`/player/${movie.id}`)}
            ref={isLast ? lastMovieRef : null}
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 50}ms both`
            }}
          >
            <Card
              poster={movie.poster_path || null}
              title={movie.title}
              rating={movie.vote_average}
            />
          </div>
        );
      })}

      {/* Loading more movies indicator */}
      {loading && !initialLoading && (
        <div className="w-full flex justify-center items-center py-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <div className="absolute top-0 left-0 animate-spin rounded-full h-8 w-8 border-r-2 border-purple-400" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <span className="text-white font-medium">Loading more movies...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toprated_Movie;
