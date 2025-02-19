import React, { useEffect, useState } from "react";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

const Popular_Movie = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const getMovie = async () => {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/popular?api_key=014463e32f320e61f3c8248c6db9ee80"
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.log("Error Fetching Data", error);
    }
  };

  useEffect(() => {
    getMovie();
  }, []);
  return (
    <div className="mr-1 mt-14 flex flex-wrap gap-4 justify-center items-center">
      {movies.map((movie) => (
        <div key={movie.id} onClick={() => navigate(`/player/${movie.id}`)}>
          <Card
            id={movie.id}
            poster={movie.poster_path}
            title={movie.title}
            rating={movie.vote_average}
          />
        </div>
      ))}
    </div>
  );
};

export default Popular_Movie;
