import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdPlayArrow, MdFullscreen } from "react-icons/md";
import { HiOutlineServerStack } from "react-icons/hi2";
import { getPlayerUrl } from "../../utils/playerUrlManager";

const Mov_Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedServer, setSelectedServer] = useState("vidsrc1");
  const [isLoading, setIsLoading] = useState(true);
  const [movieData, setMovieData] = useState(null);
  const [playerUrl, setPlayerUrl] = useState("");

  // Fetch player URL from backend/local
  useEffect(() => {
    const fetchPlayerUrl = async () => {
      try {
        const url = await getPlayerUrl("movie", id, selectedServer);
        setPlayerUrl(url);
      } catch (error) {
        console.error("Error fetching player URL:", error);
      }
    };
    fetchPlayerUrl();
  }, [id, selectedServer]);

  // Fetch movie details
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const apiKey = "014463e32f320e61f3c8248c6db9ee80";
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
        );
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };
    fetchMovieData();
  }, [id]);

  const handleServerChange = (server) => {
    setSelectedServer(server);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen ml-4 mb-4 mr-3 overflow-hidden max-md:-ml-10 max-md:mb-2">
      <div className="bg-[#121212] rounded-2xl border border-white/5 shadow-lg p-6 max-md:p-4 max-w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 max-md:mb-4 max-md:flex-col max-md:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 px-4 py-2 rounded-xl border border-white/20 hover:border-white/30 max-md:w-full max-md:justify-center"
          >
            <MdArrowBack className="text-xl" />
            <span className="max-md:inline">Back</span>
          </button>
          {movieData && (
            <div className="text-center max-md:order-first">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 max-md:text-xl">
                {movieData.title}
              </h1>
              <p className="text-gray-400 text-sm max-md:text-xs">
                {movieData.release_date?.split("-")[0]} •{" "}
                {Math.floor(movieData.runtime / 60)}h {movieData.runtime % 60}m
              </p>
            </div>
          )}
          <div className="w-20 max-md:hidden"></div>{" "}
          {/* Spacer for centering */}
        </div>

        {/* Main Player Container */}
        <div className="bg-white/5 rounded-2xl border border-white/10 shadow-lg overflow-hidden">
          {/* Video Player */}
          <div className="relative w-full">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20 rounded-t-2xl">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <p className="text-white font-medium">Loading player...</p>
                </div>
              </div>
            )}

            <iframe
              src={playerUrl}
              className="border-0 rounded-t-2xl w-full"
              style={{
                height: "70vh",
                minHeight: "400px",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
              allowFullScreen
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={`Movie Player - ${movieData?.title || "Loading..."}`}
              referrerPolicy="no-referrer"
              allow="encrypted-media"
              frameBorder="0"
            />
          </div>

          {/* Controls Section */}
          <div className="p-6 space-y-4 max-md:p-4 max-md:space-y-3">
            {/* Server Selection */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-md:gap-3">
              <div className="flex items-center gap-2 text-white">
                <HiOutlineServerStack className="text-xl text-gray-400 max-md:text-lg" />
                <span className="font-medium max-md:text-sm">Server:</span>
              </div>

              <select
                value={selectedServer}
                onChange={(e) => handleServerChange(e.target.value)}
                className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 max-md:px-3 max-md:py-1.5 max-md:text-sm"
              >
                <optgroup label="Normal Servers" className="bg-gray-700">
                  <option value="vidsrc1">Server1</option>
                  <option value="vidsrc2">Server2</option>
                  <option value="vidsrc3">Server3</option>
                  <option value="vidsrc4">Server4</option>
                  <option value="vidsrc5">Server5</option>
                </optgroup>
                <optgroup
                  label="Multi Language Servers"
                  className="bg-gray-700"
                >
                  <option value="vidsrc6">Server6</option>
                  <option value="vidsrc7">Server7</option>
                  <option value="vidsrc8">Server8</option>
                  <option value="vidsrc9">Server9</option>
                  <option value="vidsrc10">Server10</option>
                </optgroup>
                <optgroup label="Multi Embed Servers" className="bg-gray-700">
                  <option value="vidsrc11">Server11</option>
                  <option value="vidsrc12">Server12</option>
                </optgroup>
              </select>
            </div>

            {/* Movie Information */}
            {movieData && (
              <div className="border-t border-white/10 pt-4 max-md:pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-md:gap-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2 max-md:text-sm max-md:mb-1">
                      Overview
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed max-md:text-xs">
                      {movieData.overview || "No overview available."}
                    </p>
                  </div>

                  <div className="space-y-3 max-md:space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 max-md:text-xs">
                        Rating:
                      </span>
                      <span className="text-yellow-400 font-medium max-md:text-xs">
                        ⭐ {movieData.vote_average?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 max-md:text-xs">
                        Genre:
                      </span>
                      <span className="text-white max-md:text-xs">
                        {movieData.genres?.map((g) => g.name).join(", ") ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 max-md:text-xs">
                        Language:
                      </span>
                      <span className="text-white uppercase max-md:text-xs">
                        {movieData.original_language || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 max-md:mt-4 max-md:p-3">
          <div className="flex items-start gap-3 max-md:gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0 max-md:w-1.5 max-md:h-1.5 max-md:mt-1.5"></div>
            <div>
              <p className="text-white font-medium mb-1 max-md:text-sm max-md:mb-0.5">
                Playback Tips
              </p>
              <p className="text-gray-400 text-sm max-md:text-xs">
                If the video doesn't load, try switching to a different server.
                For the best experience, use fullscreen mode and ensure a stable
                internet connection.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-center max-md:mt-4 max-md:p-3">
          <p className="text-gray-400 text-sm max-md:text-xs">
            This site does not store any files on the server, we only linked to
            the media which is hosted on 3rd party services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mov_Player;
