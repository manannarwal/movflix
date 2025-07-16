import React from "react";
import Slider from "../components/Slider";
import Pop_Movie from "../components/movies/Popular_Movie";
import Toprated_Movie from "../components/movies/Toprated_Movie";
import Upcoming_Movies from "../components/movies/Upcoming_Movies";

const Home = () => {
  return (
    <div className="mr-3 ml-5 pt-4 flex flex-wrap gap-4 bg-[#121212] rounded-2xl pb-3 mb-3 max-md:bg-[#121212] max-md:-ml-9 max-lg:ml-13 shadow-lg border border-white/5">
      <Slider />
      <div className="ml-1">
        <span className="absolute text-2xl ml-1 mb-5 max-md:text-lg font-semibold text-white border-b-2 border-blue-400 pb-1">Popular Movies</span>
        <Pop_Movie/>
        <span className="absolute text-2xl ml-1 mt-7 mb-5 max-md:text-lg font-semibold text-white border-b-2 border-blue-400 pb-1">Top Rated Movies</span>
        <Toprated_Movie />
        <span className="absolute text-2xl ml-1 mt-7 mb-5 max-md:text-lg font-semibold text-white border-b-2 border-blue-400 pb-1">Upcoming Movies</span>
        <Upcoming_Movies />
        
        {/* Disclaimer */}
        <div className="mt-8 mx-2 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-center max-md:mt-6 max-md:p-3">
          <p className="text-gray-400 text-sm max-md:text-xs">
            This site does not store any files on the server, we only linked to the media which is hosted on 3rd party services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
