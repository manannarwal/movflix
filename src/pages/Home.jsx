import React from "react";
import Slider from "../components/Slider";
import Pop_Movie from "../components/Popular_Movie";
import Toprated_Movie from "../components/Toprated_Movie";
import Upcoming_Movies from "../components/Upcoming_Movies";

const Home = () => {
  return (
    <div className="mr-3 ml-5 pt-1 flex flex-wrap gap-4 bg-[#121212] rounded-2xl pb-3 mb-3 max-md:bg-[#121212] max-md:-ml-9 max-lg:ml-13">
      <Slider />
      <div className="ml-3">
      <span className="absolute underline text-2xl ml-1 mb-5 max-md:text-lg">Popular Movies</span>
        <Pop_Movie />
      <span className="absolute underline text-2xl ml-1 mt-7 mb-5 max-md:text-lg">Top Rated Movies</span>
        <Toprated_Movie />
      <span className="absolute underline text-2xl ml-1 mt-7 mb-5 max-md:text-lg">Upcoming Movies</span>
        <Upcoming_Movies />
      </div>
    </div>
  );
};

export default Home;
