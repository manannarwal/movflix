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
  ];

  return (
    <div>
      <div className="bg-black/80 backdrop-blur-3xl fixed top-0 left-0 right-0 z-50 px-3 py-3">
        <div className="relative bg-[#121212] w-full h-15 rounded-2xl flex">
          <div className="absolute text-xl px-4 py-4 text-zinc-100 tracking-wider max-md:text-lg z-50">
            <Link to="/">MovFlix</Link>
          </div>
          <Search />
        </div>
        {/* Mobile Menu Icon */}
        <div className="absolute right-6 top-7.5 hidden size-7 cursor-pointer text-gray-400 max-md:block z-50">
          {isOpen ? (
            <RxCross1 onClick={toggleMenu} className="w-6 h-6" />
          ) : (
            <RiMenuFill onClick={toggleMenu} className="w-6 h-6" />
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-screen w-64 bg-[#121212] transform transition-transform duration-300 ease-in-out z-40 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } max-md:block hidden`}
        >
          <div className="flex flex-col pt-20 px-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="text-gray-300 hover:text-white py-4 border-b border-gray-700 text-lg"
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