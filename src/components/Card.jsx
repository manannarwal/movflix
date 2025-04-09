import React, { useState } from "react";
import { CiStar } from "react-icons/ci";
import { MdImageNotSupported } from "react-icons/md";

const Card = ({ poster, title, rating, id }) => {
  const [isHovered, setIsHovered] = useState(false);

  const scaleUp = () => setIsHovered(true);
  const scaleDown = () => setIsHovered(false);

  return (
    <div
      className={`relative ${
        isHovered ? "scale-110" : "scale-100"
      } transition-transform duration-350`}
      onMouseEnter={scaleUp}
      onMouseLeave={scaleDown}
    >
      {poster ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${poster}`}
          alt={title}
          className="w-41 h-60 object-cover rounded-lg max-md:w-25 max-md:h-40"
        />
      ) : (
        <div className="w-41 h-60 bg-zinc-800 text-white flex items-center justify-center rounded-lg max-md:w-25 max-md:h-40">
          <MdImageNotSupported className="text-4xl text-gray-400" />
        </div>
      )}

      <div className="absolute top-2 right-2 flex items-center text-white font-semibold bg-black/50 px-2 py-1 rounded-md max-md:text-sm">
        <CiStar className="mr-1 text-amber-400" />
        <span>{rating?.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default Card;
