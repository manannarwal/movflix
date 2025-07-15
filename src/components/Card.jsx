import React, { useState } from "react";
import { CiStar } from "react-icons/ci";
import { MdImageNotSupported } from "react-icons/md";

const Card = ({ poster, title, rating, id, onClick, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };
  
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleClick = () => {
    if (onClick) {
      onClick({ id, title, poster, rating });
    }
  };

  const imageUrl = poster ? `https://image.tmdb.org/t/p/w500${poster}` : null;
  const numericRating = rating ? parseFloat(rating) : 0;
  const formattedRating = (numericRating > 0) ? numericRating.toFixed(1) : null;

  return (
    <article
      className={`relative group cursor-pointer ${
        isHovered ? "scale-105 z-20" : "scale-100"
      } transition-all duration-500 ease-out hover:z-10 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`View details for ${title}`}
    >
      <div className="relative overflow-hidden rounded-xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Image Container */}
        <div className="relative w-41 h-60 max-md:w-25 max-md:h-40">
          {/* Loading Skeleton */}
          {!imageLoaded && !imageError && (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse rounded-t-xl" />
          )}
          
          {/* Poster Image */}
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={title}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 text-white flex items-center justify-center border border-white/10">
              <MdImageNotSupported className="text-4xl text-gray-400" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

        {/* Rating Badge */}
        {(numericRating > 0) && (
          <div className="absolute top-3 right-3 z-10 flex items-center text-white font-bold bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl max-md:text-sm border border-white/20 shadow-lg transform translate-y-[-2px] group-hover:translate-y-0 transition-transform duration-300">
            <CiStar 
              className="mr-1.5 text-yellow-400 text-lg group-hover:rotate-12 transition-transform duration-300" 
              aria-hidden="true" 
            />
            <span className="text-sm font-bold">{formattedRating}</span>
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-out">
          <h3 className="font-bold text-base leading-tight line-clamp-2 mb-2 text-shadow-lg">
            {title}
          </h3>
          <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200" />
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
    </article>
  );
};

export default Card;
