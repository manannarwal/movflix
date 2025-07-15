import React, { useState, useCallback, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate, useLocation } from "react-router-dom";
import Search_Fetch from "./Search_Fetch";
import MangaSearchFetch from "./MangaSearchFetch";

const Search = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isMangaRoute = location.pathname.startsWith("/manga");

  const handleResults = useCallback(
    (results) => setResults(results.slice(0, 20)),
    []
  );

  const handleSelect = (item) => {
    if (isMangaRoute) {
      navigate(`/manga/${item.id}`);
    } else if (item.media_type === "movie") {
      navigate(`/player/${item.id}`);
    } else if (item.media_type === "tv") {
      navigate(`/tv/${item.id}`);
    }
    setSearch("");
    setResults([]);
    setShowResults(false);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="flex-1 flex justify-center items-center px-4 max-md:px-2">
      {/* Search Bar */}
      <div className="relative w-full max-w-md max-md:max-w-xs">
        <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400 transition-colors duration-200 max-md:size-4 max-md:left-2.5" />
        <input
          className="bg-[#191919] w-full pl-10 pr-4 py-2.5 rounded-3xl ease-in-out duration-200 outline-none focus:bg-[#202020] focus:ring-2 focus:ring-blue-400/50 border border-white/5 hover:border-white/10 placeholder-gray-400 text-white text-sm max-md:pl-8 max-md:pr-3 max-md:py-2 max-md:text-xs"
          type="text"
          value={search}
          placeholder={isMangaRoute ? "Search Mangas..." : "Search Movies, Series, Anime..."}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => {
            if (search.length >= 2) setShowResults(true);
          }}
        />
        
        {/* Search Results */}
        {showResults && search.length >= 2 && (
          isMangaRoute ? (
            <MangaSearchFetch query={search} onResults={handleResults} onSelect={handleSelect} />
          ) : (
            <Search_Fetch query={search} onResults={handleResults} onSelect={handleSelect} />
          )
        )}
      </div>
    </div>
  );
};

export default Search;
