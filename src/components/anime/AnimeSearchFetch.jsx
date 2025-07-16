import React, { useEffect, useState } from "react";
import { searchAnime } from "../../utils/animeMapping";

const AnimeSearchFetch = ({ query, onResults, onSelect }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        onResults([]);
        return;
      }

      setLoading(true);
      try {
        const animeResults = await searchAnime(query);
        const formattedResults = animeResults.map(anime => ({
          id: anime.id,
          title: anime.title,
          image: anime.image,
          rating: anime.rating || "N/A",
          media_type: "anime"
        }));
        
        setResults(formattedResults);
        onResults(formattedResults);
      } catch (error) {
        console.error("Error searching anime:", error);
        setResults([]);
        onResults([]);
      }
      setLoading(false);
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, onResults]);

  if (loading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
        <div className="p-4 text-center text-gray-400">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
          Searching anime...
        </div>
      </div>
    );
  }

  if (results.length === 0 && query.length >= 2 && !loading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
        <div className="p-4 text-center text-gray-400">
          No anime found for "{query}"
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
      {results.map((anime) => (
        <div
          key={anime.id}
          onClick={() => onSelect(anime)}
          className="flex items-center gap-3 p-3 hover:bg-[#252525] cursor-pointer border-b border-white/5 last:border-b-0 transition-colors"
        >
          <img
            src={anime.image}
            alt={anime.title}
            className="w-12 h-16 object-cover rounded"
            onError={(e) => {
              e.target.src = "/placeholder-anime.jpg";
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm truncate">
              {anime.title}
            </h3>
            <p className="text-gray-400 text-xs">
              Anime • Rating: {anime.rating}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimeSearchFetch;
