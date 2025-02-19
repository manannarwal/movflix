import React from "react";
import Search from "./Search";
import { Link } from "react-router-dom";

const navbar = () => {
  return (
    <div>
      <div className="bg-black/80 backdrop-blur-3xl fixed top-0 left-0 right-0 z-50 px-3 py-3 ">
        <div className="relative bg-[#121212] w-full h-15 rounded-2xl flex">
          <div className="absolute text-xl px-4 py-4 text-zinc-100 tracking-wider max-md:text-lg z-50">
          <Link to='/' >MovFlix</Link>
          </div>
          <Search />
        </div>
      </div>
    </div>
  );
};

export default navbar;

//<div>
 // <div className="bg-black/80 backdrop-blur-3xl fixed top-0 left-0 right-0 z-50 px-3 py-3 ">
 //   <div className="relative bg-[#121212] w-full h-15 rounded-2xl flex">
 //     <div className="absolute text-xl px-4 py-4 text-zinc-100 tracking-wider max-md:text-lg">
 //       {/* <Link to='/' >MovFlix</Link> */}
 //     </div>
 //     <div className="absolute max-md:text-sm max-md:-ml-7 max-md:mt-1 ">
 //       <Search />
 //     </div>
 //     <RiMenuFill className="absolute right-5 top-4 hidden size-7 text-gray-400 max-md:block" />
 //   </div>
  //</div>
//</div>;
