import React, { useState } from "react";
import Search from "./Search";
import { Link } from "react-router-dom";
import { RiMenuFill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { path: "/", name: "Home" },
    { path: "/movies", name: "Movies" },
    { path: "/tvshows", name: "TV Shows" },
    { path: "/anime", name: "Anime" },
    { path: "/manga", name: "Manga" },
    { path: "/livetv", name: "Live TV" },
    { path: "/connect", name: "Connect" },
  ];

  return (
    <div>
      <div className="bg-black/80 backdrop-blur-3xl fixed top-0 left-0 right-0 z-50 px-3 py-3 shadow-lg">
        <div className="relative bg-[#121212] w-full h-16 rounded-2xl flex items-center max-md:w-[93vw] max-[1024px]:w-250 shadow-md border border-white/5">
          <div className="flex-shrink-0 text-xl px-4 text-white font-semibold tracking-wider max-md:text-lg hover:text-blue-400 transition-colors duration-200">
            <Link to="/">MovFlix</Link>
          </div>
          <Search />
          
          {/* Mobile Menu Icon - Now inside flex container */}
          <div className="flex-shrink-0 hidden max-md:flex items-center pr-4">
            <div className="size-7 cursor-pointer text-gray-400">
              {isOpen ? (
                <RxCross1 onClick={toggleMenu} className="w-6 h-6" />
              ) : (
                <RiMenuFill onClick={toggleMenu} className="w-6 h-6" />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-screen w-64 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-in-out z-40 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } max-md:block hidden shadow-2xl`}
        >
          <div className="flex flex-col pt-20 px-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="text-gray-300 hover:text-blue-400 hover:bg-white/5 py-4 border-b border-gray-700/30 text-lg rounded-lg px-3 transition-all duration-200 hover:translate-x-1"
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 max-md:block hidden"
          onClick={toggleMenu}
        />
      )}
    </div>
  );
};

export default Navbar;