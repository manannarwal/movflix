import React, { useState, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import Search_Fetch from "./Search_Fetch"; // Import SearchFetch

const Search = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  // Stable function to update movies (prevents infinite loop)
  const handleResults = useCallback(
    (results) => setMovies(results.slice(0, 5)), 
    []
  );

  // Handle navigation when a result is clicked
  const handleSelect = (movie) => {
    if (movie.media_type === "movie") {
      navigate(`/player/${movie.id}`);
    } else if (movie.media_type === "tv") {
      navigate(`/tv/${movie.id}`);
    }

    setSearch(""); // Clear search input
    setMovies([]); // Hide results
  };

  return (
    <div>
      <Search_Fetch query={search} onResults={handleResults} onSelect={handleSelect} />

      <div className="mb-50 relative font-sans font-semibold">
        <div className="relative inline-block">
          <CiSearch className="absolute left-[36vw] top-[1em] size-7 text-gray-400" />
          <input
            className="bg-[#191919] ml-[35vw] mt-2.5 w-[30vw] pl-15 py-2 rounded-3xl ease-in-out duration-200 outline-none focus:bg-[#202020]"
            type="text"
            value={search}
            placeholder="Search Movies, Series, Anime..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
