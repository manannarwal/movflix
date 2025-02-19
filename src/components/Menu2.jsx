import React from "react";
import { AiFillHome } from "react-icons/ai";
import { GiNinjaHead } from "react-icons/gi";
import { BiCameraMovie } from "react-icons/bi";
import { FaTv } from "react-icons/fa6";
import { LuTv } from "react-icons/lu";
import { MdMenuBook } from "react-icons/md";
import { LuDrama } from "react-icons/lu";
import { Link } from "react-router-dom";
import { GiLoveMystery } from "react-icons/gi";


const Menu2 = () => {
  return (
    <div className="bg-[#121212] w-[12.7vw] h-[calc(99vh-5.7rem)] mx-3 mt-1 mb-3 rounded-2xl max-md:hidden">
      <div className="absolute my-[2vh] mx-[2vw] text-xl">
        <p className="flex mt-3">
          <AiFillHome className="my-1" />
          <span className="ml-5">
            <Link to="/">Home</Link>
          </span>
        </p>
        <p className="flex mt-5">
          <BiCameraMovie className="my-1" />
          <span className="ml-5">
            <Link to="/movies">Movies</Link>
          </span>
        </p>
        <p className="flex mt-5">
          <FaTv className="my-1" />
          <span className="ml-5">
          <Link to="/tvshows">Tv Shows</Link>
          </span>
        </p>
        <p className="flex mt-5">
          <GiNinjaHead className="my-1" />
          <span className="ml-5">
          <Link to="/anime">Anime</Link>
          </span>
        </p>
        <p className="flex mt-5">
          <MdMenuBook className="my-1" />
          <span className="ml-5">
          <Link to="/manga">Manga</Link>
          </span>
        </p>
        <p className="flex mt-5">
          <LuTv className="my-1" />
          <span className="ml-5">
          <Link to="/livetv">Live Tv</Link>
          </span>
        </p>
        <p className="mt-145 text-xl">
          <span className="-ml-3 flex  ">
          <span className="">Made with</span> <GiLoveMystery className="mx-2 mt-1"/> <span>by   <a href="https://manannarwal.me" target="blank">Manan</a></span> 
          </span>
        </p>
      </div>
    </div>
  );
};

export default Menu2;
