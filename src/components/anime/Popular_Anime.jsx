import React, { useEffect, useState } from "react";
import Card from "../Card";
import { useNavigate } from "react-router-dom";
import { fetchAnilistPopular } from "../../utils/anilistApi";

// Helper function to fetch with CORS handling
const Popular_Anime = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPopularAnimes = async () => {
      setLoading(true);
      try {
        const popularAnimes = await fetchAnilistPopular();
        setAnimes(popularAnimes);
      } catch (error) {
        console.error("Error loading popular animes:", error);
      }
      setLoading(false);
    };

    loadPopularAnimes();
  }, []);

  return (
    <div className="mt-10">
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

export default Popular_Anime;
