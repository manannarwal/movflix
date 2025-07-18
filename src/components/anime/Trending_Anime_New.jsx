// Trending Anime for Anime Page
import React, { useEffect, useState } from "react";
import Card from "../Card";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../../utils/aniwatchApi";

// Helper function to fetch with CORS handling
const fetchWithCORS = async (url) => {
  if (import.meta.env.PROD) {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    return JSON.parse(data.contents);
  } else {
    const response = await fetch(url);
    return await response.json();
  }
};

const Trending_Anime_New = () => {
  const [animes, setAnimes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const ITEMS_PER_LOAD = 24; // Show 24 items per load (3 rows x 8 cards)

  const loadTrendingAnimes = async (pageNumber, isLoadMore = false) => {
    setLoading(true);
    try {
      // Calculate how many pages we need to get 40 items (assuming ~20 items per API page)
      const pagesToLoad = Math.ceil(ITEMS_PER_LOAD / 20);
      let allAnimes = [];
      
      for (let i = 0; i < pagesToLoad; i++) {
        const currentPage = (pageNumber - 1) * pagesToLoad + i + 1;
        const data = await fetchWithCORS(getApiUrl(`/category/top-airing?page=${currentPage}`));
        
        if (data.status === 200 && data.data.animes) {
          const animeList = data.data.animes.map(anime => ({
            id: anime.id,
            title: anime.name,
            image: anime.poster,
            episodes: anime.episodes,
            type: anime.type
          }));
          allAnimes = [...allAnimes, ...animeList];
        }
      }
      
      // Limit to exactly 40 items per load
      const limitedAnimes = allAnimes.slice(0, ITEMS_PER_LOAD);
      
      if (isLoadMore) {
        setAnimes((prev) => [...prev, ...limitedAnimes]);
      } else {
        setAnimes(limitedAnimes);
      }
      
      // Check if we should show "Load More" (limit to 4 loads = 160 total items)
      if (pageNumber >= 4 || limitedAnimes.length < ITEMS_PER_LOAD) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading top airing animes:", error);
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTrendingAnimes(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadTrendingAnimes(nextPage, true);
  };

  return (
    <div className="">
      <div className="mr-0.5 pt-15 flex flex-wrap gap-4 max-md:gap-3.5 justify-center items-center">
        {animes.map((anime) => (
          <div key={anime.id} onClick={() => navigate(`/anime-player/${anime.id}`)}>
            <Card
              poster={anime.image || null}
              title={anime.title}
            />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-8 mb-4">
          <button
            onClick={handleLoadMore}
            className="bg-gray-600 font-sans text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Load More
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center mt-8 mb-4">
          <div className="bg-gray-700 text-white font-semibold py-3 px-8 rounded-xl opacity-50">
            Loading...
          </div>
        </div>
      )}

      {!hasMore && animes.length > 0 && (
        <div className="flex justify-center mt-8 mb-4">
          <p className="text-gray-400 text-sm">No more anime to load</p>
        </div>
      )}
    </div>
  );
};

export default Trending_Anime_New;
