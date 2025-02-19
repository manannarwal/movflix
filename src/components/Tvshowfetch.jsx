import React, { useEffect, useState } from "react";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

const Tvshowfetch = () => {
  const [movies, setMovies] = useState([]);
  const totalPages = 2;
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const getMovie = async () => {
    try {
      const apiKey = "014463e32f320e61f3c8248c6db9ee80";
      const url = "https://api.themoviedb.org/3/discover/tv";
      let allResults = [];
      let totalResults = 0;

      for (let page = 1; page <= totalPages; page++) {
        const response = await fetch(`${url}?api_key=${apiKey}&page=${page}`);
        const data = await response.json();
        allResults = [...allResults, ...data.results];
        totalResults += data.results.length;
      }
      console.log(count);
      setMovies(allResults);
      setCount(totalResults);
    } catch (error) {
      console.log("Error Fetching Data", error);
    }
  };

  useEffect(() => {
    getMovie();
  }, []);
  
  return (
    <div className="mb-3.5">
        <span className="absolute ml-3 mt-4   text-xl">{`${count}`} Results</span>
      <div className="mr-0.5 pt-15 flex flex-wrap gap-4 bg-[#121212] rounded-2xl pb-3 justify-center items-center">
        {movies.map((movie) => (
                    <div key={movie.id} onClick={() => navigate(`/tv/${movie.id}`)}>
          <Card
            key={movie.id}
            poster={movie.poster_path}
            title={movie.title}
            rating={movie.vote_average}
          />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tvshowfetch;
