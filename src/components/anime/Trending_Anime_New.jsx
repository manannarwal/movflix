// Trending Anime for Anime Page
import React, { useEffect, useState } from "react";
import Card from "../Card";
import { useNavigate } from "react-router-dom";
import { fetchAnilistTrending } from "../../utils/anilistApi";

// Helper function to fetch with CORS handling
const Trending_Anime_New = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrendingAnimes = async () => {
      setLoading(true);
      try {
        const trendingAnimes = await fetchAnilistTrending();
        setAnimes(trendingAnimes);
      } catch (error) {
        console.error("Error loading trending animes:", error);
      }
      setLoading(false);
    };

    loadTrendingAnimes();
  }, []);

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

      {/* Loading Skeleton */}
      {loading && (
        <div className="flex justify-center mt-8 mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default Trending_Anime_New;
