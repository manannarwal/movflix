import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";

const API_KEY = "014463e32f320e61f3c8248c6db9ee80";
const MOVIE_API_URL = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`;

const Slider = () => {
  const [movies, setMovies] = useState([]);
  const [logos, setLogos] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const navigate = useNavigate();

  // Refs for dragging
  const sliderRef = useRef(null);
  const startXRef = useRef(0);
  const draggingRef = useRef(false);

  // Fetch upcoming movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(MOVIE_API_URL);
        const data = await response.json();
        const sliced = data.results.slice(0, 6); // Use only 6 movies
        setMovies(sliced);

        // For each movie, fetch its logo
        sliced.forEach((movie) => {
          fetchMovieLogo(movie.id);
        });
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  // Fetch movie logo for a given movie
  const fetchMovieLogo = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${API_KEY}`
      );
      const data = await response.json();
      const logoPath =
        data.logos && data.logos.length > 0 ? data.logos[0].file_path : null;
      setLogos((prevLogos) => ({
        ...prevLogos,
        [movieId]: logoPath ? `https://image.tmdb.org/t/p/original${logoPath}` : null,
      }));
    } catch (error) {
      console.error(`Error fetching logo for movie ${movieId}:`, error);
    }
  };

  // Auto-slide every 5 seconds (only if not dragging)
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      if (!draggingRef.current) {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [movies]);

  // Handle mouse down: start drag
  const handleMouseDown = (e) => {
    draggingRef.current = true;
    startXRef.current = e.clientX;
  };

  // Handle mouse move: update drag offset in real time
  const handleMouseMove = (e) => {
    if (!draggingRef.current) return;
    const delta = e.clientX - startXRef.current;
    setDragOffset(delta);
  };

  // Handle mouse up: decide if we should move to next/previous slide based on drag threshold
  const handleMouseUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    // Determine slide width (each slide fills the slider container)
    const sliderWidth = sliderRef.current ? sliderRef.current.clientWidth : 0;
    const threshold = sliderWidth / 4; // adjust threshold as needed

    if (dragOffset > threshold) {
      // Dragged to right: move to previous slide
      setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
    } else if (dragOffset < -threshold) {
      // Dragged to left: move to next slide
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }
    // Reset drag offset (snaps back)
    setDragOffset(0);
  };

  // If movies have not loaded, show loading text
  if (movies.length === 0)
    return <div className="text-white text-center">Loading...</div>;

  // Calculate slide width from container ref (if available)
  const slideWidth = sliderRef.current ? sliderRef.current.clientWidth : 0;
  // Compute the translateX value: start from current slide, then add the drag offset.
  const translateX = -currentIndex * slideWidth + dragOffset;

  return (
    <div
      className="relative w-full h-[30rem] ml-3.5 mr-3.5 mt-2 rounded-2xl overflow-hidden select-none max-md:h-[15rem]"
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // in case mouse leaves the container during drag
    >
      {/* Slider container: flex row with all slides */}
      <div
        className={`flex h-full transition-transform duration-300 ease-out`}
        style={{ transform: `translateX(${translateX}px)` }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="w-full flex-shrink-0 relative">
            {/* Each Slide */}
            {/* Background Image with Blur */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-sm max-md:blur-none"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              }}
            ></div>
            {/* Content Overlay */}
            <div className="absolute inset-0 bg-black/50 flex items-center px-20">
              {/* Left Section: Movie Details */}
              <div className="w-1/2 text-white space-y-3 max-md:space-y-1 max-md:w-35 ">
                {logos[movie.id] ? (
                  <img
                    src={logos[movie.id]}
                    alt={movie.title}
                    className="h-20 max-md:h-15 max-md:-ml-15"
                  />
                ) : (
                  <h1 className="text-5xl font-bold max-md:text-xs">{movie.title}</h1>
                )}
                <p className="text-lg text-gray-300 flex items-center gap-2 max-md:text-xs max-md:-ml-15 max-md:w-100 max-md:gap-1">
                  MOVIE • <FaRegStar className="text-yellow-500" />{" "}
                  {movie.vote_average?.toFixed(1) || "N/A"} • 📅{" "}
                  {movie.release_date}
                </p>
                <p className="text-gray-400 line-clamp-3 w-[90%] max-md:w-70 max-md:-ml-15 max-md:-mb-10 max-md:text-xs">
                  {movie.overview}
                </p>
                <button
                  className="bg-zinc-800/70 mt-8 px-6 py-3 text-lg font-semibold rounded-3xl font-sans hover:bg-[#303030]/80 transition-all max-md:mt-12 max-md:-ml-15 max-md:px-12 max-md:py-2 max-md:text-xs max-md:"
                  onClick={() => navigate(`/player/${movie.id}`)}
                >
                  <p className="flex max-md:-ml-11 max-md:-mr-10">▶ Watch Now</p>
                </button>
              </div>
              {/* Right Section: Rotated Movie Poster */}
              <div className="absolute right-20 top-10 max-md:hidden w-100">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-64 h-auto shadow-lg transform rotate-[15deg] scale-110 max-md:w-30 max-md:h-auto max-md:-mt-2 "
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
