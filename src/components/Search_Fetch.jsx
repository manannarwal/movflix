import React, { useState, useEffect } from "react";
import { MdImageNotSupported } from "react-icons/md";

const API_KEY = "014463e32f320e61f3c8248c6db9ee80";

const Search_Fetch = ({ query, onResults, onSelect }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchResults = async () => {
        if (!query || query.trim().length < 2) {
          setMovies([]);
          onResults([]);
          return;
        }

        setLoading(true);
        try {
          const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
          const response = await fetch(url);
          const data = await response.json();
          setMovies(data.results || []);
          onResults(data.results || []);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setMovies([]);
          onResults([]);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }, 500); // debounce for 500ms

    return () => clearTimeout(delayDebounce);
  }, [query, onResults]);

  return (
    (movies.length > 0 || loading) && (
      <div className="absolute left-[35vw] w-[30vw] mt-13 bg-[#202020] rounded-xl shadow-lg p-3 text-white max-md:fixed max-md:w-[53vw] max-md:mt-14 max-md:left-[29vw] max-md:text-sm">
        {loading && (
          <p className="text-center text-gray-400 py-2">Loading...</p>
        )}
        {!loading &&
          movies.slice(0, 5).map((movie) => (
            <div
              key={movie.id}
              className="flex items-center gap-3 p-2 border-b border-gray-700 hover:bg-[#282828] cursor-pointer"
              onClick={() => onSelect(movie)}
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className="w-12 h-16 rounded-lg"
                />
              ) : (
                <div className="w-12 h-16 bg-zinc-800 rounded-lg flex items-center justify-center">
                  <MdImageNotSupported />
                </div>
              )}

              <div>
                <p className="font-semibold">{movie.title || movie.name}</p>
                <p className="text-gray-400 text-sm">
                  {movie.media_type === "movie" ? "Movie" : "TV Show"} • ⭐{" "}
                  {movie.vote_average?.toFixed(1) || "N/A"}
                </p>
                <p className="text-gray-400 text-sm">
                  {movie.release_date || movie.first_air_date || "Unknown Date"}
                </p>
              </div>
            </div>
          ))}
      </div>
    )
  );
};

export default Search_Fetch;
