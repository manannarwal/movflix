import React, { useState } from "react";
import { CiStar } from "react-icons/ci";

const Card = ({poster, title, rating, id}) => {

  const [isHovered, setIsHovered] = useState(false)

  const scaleUp = () =>{
    setIsHovered(true);
  }
  const scaleDown = () =>{
    setIsHovered(false);
    
  }

  return (
    
      <div className={`relative ${isHovered ? 'scale-110' : 'scale-100'} transition-transform duration-350v`} >
      <img 
          src={`https://image.tmdb.org/t/p/w500${poster}`}
          alt={title} onMouseEnter={scaleUp} onMouseLeave={scaleDown}
          className={`w-41 h-60 object-cover rounded-lg `}
        />
        <div className="absolute top-2 right-2 flex items-center text-white font-semibold bg-black/50 px-2 py-1 rounded-md">
          <CiStar className="mr-1 text-amber-400" />
          <span>{rating?.toFixed(1)}</span>

        </div>
      </div>
    
  );
};

export default Card;
