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
      <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b from-[#1f1f1f] via-[#1a1a1a] to-[#151515] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white z-50 max-h-96 overflow-hidden animate-in slide-in-from-top-2 duration-300 max-md:rounded-xl max-md:mt-1">
        {loading && (
          <div className="flex items-center justify-center py-6 max-md:py-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 max-md:h-6 max-md:w-6"></div>
              <div className="absolute top-0 left-0 animate-spin rounded-full h-8 w-8 border-r-2 border-purple-400 max-md:h-6 max-md:w-6" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <span className="ml-3 text-gray-300 font-medium max-md:text-sm max-md:ml-2">Searching...</span>
          </div>
        )}
        {!loading && (
          <div className="max-h-96 overflow-y-auto p-4 search-scrollbar max-md:p-2 max-md:max-h-80">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className="flex items-center gap-4 p-3 border-b border-white/5 hover:bg-gradient-to-r hover:from-white/5 hover:to-blue-500/5 cursor-pointer rounded-xl transition-all duration-300 hover:scale-[1.02] group hover:shadow-lg last:border-b-0 max-md:gap-2 max-md:p-2 max-md:rounded-lg"
                onClick={() => onSelect(movie)}
                style={{ 
                  animation: `fadeInUp 0.3s ease-out ${index * 50}ms both`
                }}
              >
                <div className="relative group">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title || movie.name}
                      className="w-14 h-20 rounded-xl flex-shrink-0 object-cover shadow-lg group-hover:shadow-xl transition-all duration-300 border border-white/10 max-md:w-10 max-md:h-14 max-md:rounded-lg"
                    />
                  ) : (
                    <div className="w-14 h-20 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10 max-md:w-10 max-md:h-14 max-md:rounded-lg">
                      <MdImageNotSupported className="text-gray-400 text-lg max-md:text-sm" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-md:rounded-lg"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white group-hover:text-blue-400 transition-colors duration-300 truncate text-base leading-tight max-md:text-sm max-md:font-semibold">
                    {movie.title || movie.name}
                  </p>
                  <div className="flex items-center gap-3 mt-2 max-md:gap-2 max-md:mt-1 max-md:flex-wrap">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full text-xs font-semibold border border-blue-500/20 max-md:px-2 max-md:py-0.5 max-md:text-[10px]">
                      {movie.media_type === "movie" ? "Movie" : "TV Show"}
                    </span>
                    <span className="flex items-center gap-1.5 text-yellow-400 font-medium text-sm max-md:text-xs max-md:gap-1">
                      ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1 truncate max-md:text-xs max-md:mt-0.5">
                    {movie.release_date || movie.first_air_date || "Unknown Date"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  );
};

export default Search_Fetch;
