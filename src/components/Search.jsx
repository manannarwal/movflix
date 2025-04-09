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
    (results) => setResults(results.slice(0, 5)),
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
    <div ref={searchRef}>
      {/* Search Results */}
      {showResults && search.length >= 2 && (
        isMangaRoute ? (
          <MangaSearchFetch query={search} onResults={handleResults} onSelect={handleSelect} />
        ) : (
          <Search_Fetch query={search} onResults={handleResults} onSelect={handleSelect} />
        )
      )}

      {/* Search Bar */}
      <div className="mb-50 relative font-sans font-semibold">
        <div className="relative inline-block">
          <CiSearch className="absolute left-[36vw] top-[1em] size-7 text-gray-400 max-md:size-6 max-md:left-26 max-md:pt-1" />
          <input
            className="bg-[#191919] ml-[35vw] mt-2.5 w-[30vw] pl-15 py-2 rounded-3xl ease-in-out duration-200 outline-none focus:bg-[#202020] max-md:mt-3.5 max-md:ml-25 max-md:pl-7 max-md:w-[53vw] max-md:text-xs"
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
        </div>
      </div>
    </div>
  );
};

export default Search;
