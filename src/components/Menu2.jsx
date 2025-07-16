import React from "react";
import { AiFillHome } from "react-icons/ai";
import { GiNinjaHead } from "react-icons/gi";
import { BiCameraMovie } from "react-icons/bi";
import { FaTv } from "react-icons/fa6";
import { LuTv } from "react-icons/lu";
import { MdMenuBook, MdConnectWithoutContact } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";



const Menu2 = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-[#121212] w-[12.7vw] h-[calc(99vh-5.7rem)] mx-3 mt-1 mb-3 rounded-2xl max-md:hidden max-lg:w-[18.7vw] max-xl:mr-10 max-lg:pr-40 shadow-lg border border-white/5">
      <div className="absolute my-[2vh] mx-[2vw] text-xl max-xl:text-lg">
        <Link to="/">
          <p className={`flex mt-3 p-2 rounded-lg transition-all duration-200 cursor-pointer ${
            isActive("/") 
              ? 'text-blue-400 bg-blue-500/20 border border-blue-400/30' 
              : 'hover:text-blue-400 hover:bg-white/5'
          }`}>
            <AiFillHome className="my-1" />
            <span className="ml-5">Home</span>
          </p>
        </Link>
        
        <Link to="/movies">
          <p className={`flex mt-5 p-2 rounded-lg transition-all duration-200 cursor-pointer ${
            isActive("/movies") 
              ? 'text-blue-400 bg-blue-500/20 border border-blue-400/30' 
              : 'hover:text-blue-400 hover:bg-white/5'
          }`}>
            <BiCameraMovie className="my-1" />
            <span className="ml-5">Movies</span>
          </p>
        </Link>

        <Link to="/tvshows">
          <p className={`flex mt-5 p-2 rounded-lg transition-all duration-200 cursor-pointer ${
            isActive("/tvshows") 
              ? 'text-blue-400 bg-blue-500/20 border border-blue-400/30' 
              : 'hover:text-blue-400 hover:bg-white/5'
          }`}>
            <FaTv className="my-1" />
            <span className="ml-5">Tv Shows</span>
          </p>
        </Link>

        <Link to="/anime">
          <p className={`flex mt-5 p-2 pr-10 rounded-lg transition-all duration-200 cursor-pointer relative ${
            isActive("/anime") 
              ? 'text-blue-400 bg-blue-500/20 border border-blue-400/30' 
              : 'hover:text-blue-400 hover:bg-white/5'
          }`}>
            <GiNinjaHead className="my-1" />
            <span className="ml-5 flex items-center gap-2">
              Anime
              <span className="relative">
                <span className="absolute -top-1.5 -right-7 text-[11px] font-bold text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text animate-pulse">
                  NEW
                </span>
              </span>
            </span>
          </p>
        </Link>

        <Link to="/manga">
          <p className={`flex mt-5 p-2 rounded-lg transition-all duration-200 cursor-pointer ${
            isActive("/manga") 
              ? 'text-blue-400 bg-blue-500/20 border border-blue-400/30' 
              : 'hover:text-blue-400 hover:bg-white/5'
          }`}>
            <MdMenuBook className="my-1" />
            <span className="ml-5">Manga</span>
          </p>
        </Link>

        <Link to="/livetv">
          <p className={`flex mt-5 p-2 rounded-lg transition-all duration-200 cursor-pointer ${
            isActive("/livetv") 
              ? 'text-blue-400 bg-blue-500/20 border border-blue-400/30' 
              : 'hover:text-blue-400 hover:bg-white/5'
          }`}>
            <LuTv className="my-1" />
            <span className="ml-5">Live Tv</span>
          </p>
        </Link>

        <Link to="/connect">
          <p className={`flex mt-5 p-2 rounded-lg transition-all duration-200 cursor-pointer ${
            isActive("/connect") 
              ? 'text-blue-400 bg-blue-500/20 border border-blue-400/30' 
              : 'hover:text-blue-400 hover:bg-white/5'
          }`}>
            <MdConnectWithoutContact className="my-1" />
            <span className="ml-5">Connect</span>
          </p>
        </Link>
        {/* <p className="mt-145 text-xl">
          <span className="-ml-3 flex  ">
          <span className="">Made with</span> ❤️ <span>by   <a href="https://manannarwal.me" target="blank">Manan</a></span> 
          </span>
        </p> */}
        {/* Can be added later */}
      </div>
    </div>
  );
};

export default Menu2;
