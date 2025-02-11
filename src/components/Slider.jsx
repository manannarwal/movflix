import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";

const API_KEY = "014463e32f320e61f3c8248c6db9ee80";
const MOVIE_API_URL = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`;

const Slider = () => {
  const [movies, setMovies] = useState([]);
  const [logos, setLogos] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Fetch upcoming movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(MOVIE_API_URL);
        const data = await response.json();
        setMovies(data.results.slice(0, 6)); // Get only 6 movies

        // Fetch logos for each movie
        data.results.slice(0, 6).forEach((movie) => {
          fetchMovieLogo(movie.id);
        });
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  // Fetch logo for a specific movie
  const fetchMovieLogo = async (movieId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${API_KEY}`);
      const data = await response.json();
      
      // Extract logo from API response
      const logoPath = data.logos?.length > 0 ? data.logos[0].file_path : null;

      // Store logo in state
      setLogos((prevLogos) => ({
        ...prevLogos,
        [movieId]: logoPath ? `https://image.tmdb.org/t/p/original${logoPath}` : null
      }));
    } catch (error) {
      console.error(`Error fetching logo for movie ${movieId}:`, error);
    }
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) return <div>Loading...</div>;

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-[111rem] h-[30rem] ml-3.5 mt-2 rounded-2xl overflow-hidden">
      {/* Background Image with Blur Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})` }}
      ></div>

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black/50 flex items-center px-20">
        {/* Left Section: Movie Details */}
        <div className="w-1/2 text-white space-y-3">
          {/* Movie Logo or Title */}
          {logos[currentMovie.id] ? (
            <img src={logos[currentMovie.id]} alt={currentMovie.title} className="h-30" />
          ) : (
            <h1 className="text-4xl font-bold">{currentMovie.title}</h1>
          )}

          <p className="text-lg text-gray-300">
            MOVIE • ☆ {currentMovie.vote_average?.toFixed(1) || "N/A"} • 📅 {currentMovie.release_date}
          </p>
          <p className="text-gray-400 line-clamp-3 w-[90%]">{currentMovie.overview}</p>

          {/* Watch Now Button */}
          <button
            className="bg-zinc-800/50 mt-8 px-5 py-2 text-lg bg-opa font-semibold rounded-3xl font-sans hover:bg-[#303030] transition"
            onClick={() => navigate(`/player/${currentMovie.id}`)}
          >
            ▶ Watch Now
          </button>
        </div>

        {/* Right Section: Rotated Movie Poster */}
        <div className="absolute right-20 top-10">
          <img
            src={`https://image.tmdb.org/t/p/w300${currentMovie.poster_path}`}
            alt={currentMovie.title}
            className="w-115 h-150 -mt-23 mr-15 shadow-lg transform rotate-[15deg]"
          />
        </div>
      </div>
    </div>
  );
};

export default Slider;
