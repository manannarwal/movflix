import React from "react";
import AnimeSlider from "../components/anime/AnimeSlider";
import Popular_Anime from "../components/anime/Popular_Anime";
import Recent_Anime from "../components/anime/Recent_Anime";
import Trending_Anime_New from "../components/anime/Trending_Anime_New";

const Anime = () => {
  return (
    <div className="mr-3 ml-5 pt-4 flex flex-wrap gap-4 bg-[#121212] rounded-2xl pb-3 mb-3 max-md:bg-[#121212] max-md:-ml-9 max-lg:ml-13 shadow-lg border border-white/5">
      <AnimeSlider />

      <div className="ml-1">
        <span className="absolute text-2xl ml-2 mb-5 max-md:text-lg font-semibold text-white border-b-2 border-blue-400 pb-1">
          Trending Anime
        </span>
        <Trending_Anime_New />

        <span className="absolute text-2xl ml-2 mt-7 mb-5 max-md:text-lg font-semibold text-white border-b-2 border-blue-400 pb-1">
          Popular Anime
        </span>
        <Popular_Anime />

        <span className="absolute text-2xl ml-2 mt-7 mb-5 max-md:text-lg font-semibold text-white border-b-2 border-blue-400 pb-1">
          Recent Episodes
        </span>
        <Recent_Anime />

        {/* Disclaimer */}
        <div className="mt-8 mx-2 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-center max-md:mt-6 max-md:p-3">
          <p className="text-gray-400 text-sm max-md:text-xs">
            Anime content is streamed from third-party sources. We do not host
            any files on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Anime;
