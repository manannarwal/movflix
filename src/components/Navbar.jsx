import React from "react";
import Search from "./Search";

const navbar = () => {
  return (
    <div>
      <div className="bg-black/80 backdrop-blur-3xl fixed top-0 left-0 right-0 z-50 px-3 py-3 ">
        <div className="relative bg-[#121212] w-full h-15 rounded-2xl flex">
          <div className="absolute text-xl px-4 py-4 text-zinc-100 tracking-wider">
          MovFlix
          </div>
          <Search />
        </div>
      </div>
    </div>
  );
};

export default navbar;
