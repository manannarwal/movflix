import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAnimeInfoById, getApiUrl } from "../../utils/aniwatchApi";

const AnimeSlider = () => {
  const [animes, setAnimes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const navigate = useNavigate();

  // Refs for dragging
  const sliderRef = useRef(null);
  const startXRef = useRef(0);
  const draggingRef = useRef(false);

  // Fetch top airing anime
  useEffect(() => {
    const fetchTopAiringAnime = async () => {
      try {
        const response = await fetch(getApiUrl('/category/top-airing?page=1'));
        const data = await response.json();
        
        if (data.status === 200 && data.data.animes) {
          const sliced = data.data.animes.slice(0, 6); // Use only 6 anime
          
          // Fetch detailed info for each anime to get descriptions
          const animesWithDetails = await Promise.all(
            sliced.map(async (anime) => {
              try {
                const detailedInfo = await getAnimeInfoById(anime.id);
                return {
                  ...anime,
                  description: detailedInfo.description || 'No description available'
                };
              } catch (error) {
                console.error(`Error fetching details for anime ${anime.id}:`, error);
                return {
                  ...anime,
                  description: 'Description unavailable'
                };
              }
            })
          );
          
          setAnimes(animesWithDetails);
        }
      } catch (error) {
        console.error("Error fetching top airing anime:", error);
      }
    };
    fetchTopAiringAnime();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (animes.length === 0) return;
    
    const interval = setInterval(() => {
      if (!draggingRef.current) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % animes.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [animes.length]);

  // Mouse/Touch drag handlers
  const handleStart = (clientX) => {
    draggingRef.current = true;
    startXRef.current = clientX;
    setDragOffset(0);
  };

  const handleMove = (clientX) => {
    if (!draggingRef.current) return;
    const diff = clientX - startXRef.current;
    setDragOffset(diff);
  };

  const handleEnd = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    const threshold = 100;
    if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (dragOffset < -threshold && currentIndex < animes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    setDragOffset(0);
  };

  // Mouse event handlers
  const handleMouseDown = (e) => handleStart(e.clientX);
  const handleMouseMove = (e) => handleMove(e.clientX);
  const handleMouseUp = () => handleEnd();

  // Touch event handlers
  const handleTouchStart = (e) => handleStart(e.touches[0].clientX);
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleEnd();

  // Navigate to anime player
  const handleAnimeClick = (animeId) => {
    navigate(`/anime-player/${animeId}`);
  };

  // Format airing date
  const formatAiringDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateStr; // Return as-is if parsing fails
    }
  };

  if (animes.length === 0) {
    return (
      <div className="w-full h-[30rem] max-md:h-[15rem] bg--[121212] mx-2 border-1 border-gray-600 rounded-2xl animate-pulse flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  const currentAnime = animes[currentIndex];

  return (
    <div className="relative w-full mx-3 h-[30rem] max-md:h-[15rem] overflow-hidden rounded-2xl shadow-2xl group">
      {/* Background Image */}
      <div
        className="absolute filter blur-sm max-md:blur-none inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${currentAnime?.poster || ''})`,
          transform: `translateX(${dragOffset}px)`,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-between">
        <div className="ml-8 max-w-2xl max-md:ml-4 max-md:max-w-xs">
          {/* Anime Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-md:text-2xl leading-tight drop-shadow-2xl">
            {currentAnime?.name || 'Loading...'}
          </h1>

          {/* Anime Info */}
          <div className="flex items-center gap-4 mb-4 max-md:gap-2 max-md:mb-3">
            {currentAnime?.episodes && (
              <span className="bg-zinc-600 text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                Episodes: {typeof currentAnime.episodes === 'object' 
                  ? (currentAnime.episodes.sub || currentAnime.episodes.dub || 'N/A')
                  : currentAnime.episodes}
              </span>
            )}
            {currentAnime?.aired?.from && (
              <span className="text-gray-200 text-sm">
                Aired: {formatAiringDate(currentAnime.aired.from)}
              </span>
            )}
          </div>

          {/* Description */}
          {currentAnime?.description && (
            <p className="text-gray-400 line-clamp-3 w-[90%] max-md:w-70 max-md:-ml-15 max-md:-mb-10 max-md:text-xs">
              {currentAnime.description.length > 400
                ? `${currentAnime.description.substring(0, 400)}...`
                : currentAnime.description}
            </p>
          )}

          {/* Watch Now Button */}
          <button
            onClick={() => handleAnimeClick(currentAnime?.id)}
            className="bg-zinc-800/70 mt-6 px-6 py-3 text-lg font-semibold rounded-3xl font-sans hover:bg-[#303030]/80 transition-all max-md:mt-12 max-md:-ml-15 max-md:px-12 max-md:py-2 max-md:text-xs max-md:"
          >
            ▶ Watch Now
          </button>
        </div>

        {/* Anime Poster on Right */}
        <div className="mr-42 max-md:hidden">
          <div 
            className="w-70 h-105 bg-cover bg-center rounded-sm transform rotate-10"
            style={{
              backgroundImage: `url(${currentAnime?.poster || ''})`,
            }}
          />
        </div>
      </div>

      {/* Draggable Area */}
      <div
        ref={sliderRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

    </div>
  );
};

export default AnimeSlider;