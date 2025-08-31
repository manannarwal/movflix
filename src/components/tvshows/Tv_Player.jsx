import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdPlayArrow, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { HiOutlineServerStack } from "react-icons/hi2";
import { BiSolidMoviePlay } from "react-icons/bi";

const Tv_Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedServer, setSelectedServer] = useState("vidlink");
  const [isLoading, setIsLoading] = useState(true);
  const [showData, setShowData] = useState(null);

  const serverOptions = [
    { value: "vidlink", label: "Primary Server"},
    { value: "vidsrc1", label: "Secondary Server"},
    { value: "vidsrc2", label: "Backup Server"},
  ];

  const serverUrls = {
    vidlink: `https://vidlink.pro/tv/${id}/${selectedSeason}/${selectedEpisode}`,
    vidsrc1: `https://vidsrc.in/embed/tv?tmdb=${id}&season=${selectedSeason}&episode=${selectedEpisode}`,
    vidsrc2: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode}`,
  };

  // Load saved state from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`tv_${id}`);
    if (savedData) {
      const { season, episode } = JSON.parse(savedData);
      setSelectedSeason(season);
      setSelectedEpisode(episode);
    }
  }, [id]);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(`tv_${id}`, JSON.stringify({
      season: selectedSeason,
      episode: selectedEpisode,
    }));
  }, [id, selectedSeason, selectedEpisode]);

  // Fetch show details and seasons
  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const apiKey = "014463e32f320e61f3c8248c6db9ee80";
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`
        );
        const data = await response.json();
        setShowData(data);
        const seasonList = data.seasons
          .filter(season => season.season_number > 0)
          .map((season) => season.season_number);
        setSeasons(seasonList);
      } catch (error) {
        console.error("Error fetching show data:", error);
      }
    };
    fetchShowData();
  }, [id]);

  // Fetch episodes when season changes
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const apiKey = "014463e32f320e61f3c8248c6db9ee80";
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${apiKey}&language=en-US`
        );
        const data = await response.json();
        const episodeList = data.episodes.map((episode) => episode.episode_number);
        setEpisodes(episodeList);
        
        // Reset to episode 1 if current episode doesn't exist in new season
        if (!episodeList.includes(selectedEpisode)) {
          setSelectedEpisode(1);
        }
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    };

    if (selectedSeason) {
      fetchEpisodes();
    }
  }, [id, selectedSeason]);

  const handleServerChange = (server) => {
    setIsLoading(true);
    setSelectedServer(server);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    // Silently handle iframe errors from third-party content
    setIsLoading(false);
  };

  // Suppress third-party console errors
  useEffect(() => {
    const handleError = (event) => {
      // Suppress errors from third-party iframe sources
      if (event.target && event.target.tagName === 'IFRAME') {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('error', handleError, true);
    return () => window.removeEventListener('error', handleError, true);
  }, []);

  const handlePreviousEpisode = () => {
    if (selectedEpisode > 1) {
      setSelectedEpisode(selectedEpisode - 1);
      setIsLoading(true);
    } else if (selectedSeason > 1) {
      setSelectedSeason(selectedSeason - 1);
      // Episode will be set when episodes are fetched for new season
    }
  };

  const handleNextEpisode = () => {
    if (selectedEpisode < episodes.length) {
      setSelectedEpisode(selectedEpisode + 1);
      setIsLoading(true);
    } else if (selectedSeason < seasons.length) {
      setSelectedSeason(selectedSeason + 1);
      setSelectedEpisode(1);
      setIsLoading(true);
    }
  };

  return (
    <div className="min-h-screen mx-4 mb-3.5 overflow-hidden max-md:-ml-10 max-md:mb-2">
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

          {showData && (
            <div className="text-center max-md:order-first">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 max-md:text-xl">
                {showData.name}
              </h1>
              <p className="text-gray-400 text-sm max-md:text-xs">
                Season {selectedSeason} • Episode {selectedEpisode}
                {showData.first_air_date && ` • ${showData.first_air_date.split('-')[0]}`}
              </p>
            </div>
          )}

          <div className="w-20 max-md:hidden"></div> {/* Spacer for centering */}
        </div>

        {/* Main Player Container */}
        <div className="bg-white/5 rounded-2xl border border-white/10 shadow-lg overflow-hidden">
          {/* Video Player */}
          <div className="relative w-full">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20 rounded-t-2xl">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <p className="text-white font-medium">Loading episode...</p>
                </div>
              </div>
            )}
            
            <iframe
              src={serverUrls[selectedServer]}
              className="border-0 rounded-t-2xl w-full"
              style={{ 
                height: '70vh',
                minHeight: '400px',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
              allowFullScreen
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={`TV Player - ${showData?.name || 'Loading...'} S${selectedSeason}E${selectedEpisode}`}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Controls Section */}
          <div className="p-6 space-y-6 max-md:p-4 max-md:space-y-4">
            {/* Episode Navigation */}
            <div className="flex items-center justify-center gap-4 max-md:gap-2 max-md:flex-wrap">
              <button
                onClick={handlePreviousEpisode}
                disabled={selectedSeason === 1 && selectedEpisode === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-500 text-white rounded-xl transition-all duration-300 border border-white/20 disabled:border-white/10 max-md:px-3 max-md:py-1.5 max-md:text-sm"
              >
                <MdSkipPrevious className="text-xl max-md:text-lg" />
                <span className="hidden sm:inline max-md:hidden">Previous</span>
              </button>
              
              <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-xl border border-white/20 max-md:px-3 max-md:py-1.5">
                <BiSolidMoviePlay className="text-gray-400 max-md:text-sm" />
                <span className="font-medium max-md:text-sm">S{selectedSeason}E{selectedEpisode}</span>
              </div>
              
              <button
                onClick={handleNextEpisode}
                disabled={selectedSeason === seasons[seasons.length - 1] && selectedEpisode === episodes.length}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-500 text-white rounded-xl transition-all duration-300 border border-white/20 disabled:border-white/10 max-md:px-3 max-md:py-1.5 max-md:text-sm"
              >
                <span className="hidden sm:inline max-md:hidden">Next</span>
                <MdSkipNext className="text-xl max-md:text-lg" />
              </button>
            </div>

            {/* Season & Episode Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-md:gap-3">
              <div>
                <label className="block text-white font-medium mb-2 max-md:text-sm max-md:mb-1">Season</label>
                <select
                  className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all max-md:p-2 max-md:text-sm"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                >
                  {seasons.map((season) => (
                    <option key={season} value={season} className="bg-gray-800">
                      Season {season}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2 max-md:text-sm max-md:mb-1">Episode</label>
                <select
                  className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all max-md:p-2 max-md:text-sm"
                  value={selectedEpisode}
                  onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                >
                  {episodes.map((episode) => (
                    <option key={episode} value={episode} className="bg-gray-800">
                      Episode {episode}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Server Selection */}
            <div className="space-y-3 max-md:space-y-2">
              <div className="flex items-center gap-2 text-white">
                <HiOutlineServerStack className="text-xl text-gray-400 max-md:text-lg" />
                <span className="font-medium max-md:text-sm">Server:</span>
              </div>
              
              <div className="flex flex-wrap gap-2 max-md:gap-1.5">
                {serverOptions.map((server) => (
                  <button
                    key={server.value}
                    onClick={() => handleServerChange(server.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border max-md:px-3 max-md:py-1.5 max-md:text-sm ${
                      selectedServer === server.value
                        ? 'bg-white/20 border-white/30 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="font-medium">{server.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Show Information */}
            {showData && (
              <div className="border-t border-white/10 pt-4 max-md:pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-md:gap-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2 max-md:text-sm max-md:mb-1">Overview</h3>
                    <p className="text-gray-300 text-sm leading-relaxed max-md:text-xs">
                      {showData.overview || "No overview available."}
                    </p>
                  </div>
                  
                  <div className="space-y-3 max-md:space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 max-md:text-xs">Rating:</span>
                      <span className="text-yellow-400 font-medium max-md:text-xs">
                        ⭐ {showData.vote_average?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 max-md:text-xs">Seasons:</span>
                      <span className="text-white max-md:text-xs">{showData.number_of_seasons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 max-md:text-xs">Episodes:</span>
                      <span className="text-white max-md:text-xs">{showData.number_of_episodes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 max-md:text-xs">Status:</span>
                      <span className="text-white max-md:text-xs">{showData.status}</span>
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
            <div className="w-2 bg-green-500 h-2 rounded-full mt-2 flex-shrink-0 max-md:w-1.5 max-md:h-1.5 max-md:mt-1.5"></div>
            <div>
              <p className="text-white font-medium mb-1 max-md:text-sm max-md:mb-0.5">Viewing Tips</p>
              <p className="text-gray-400 text-sm max-md:text-xs">
                Use the navigation buttons to quickly move between episodes. 
                Your progress is automatically saved. Switch servers if experiencing playback issues.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 max-md:mt-4 max-md:p-3 text-center">
          <p className="text-gray-400 text-sm max-md:text-xs">
            This site does not store any files on the server, we only linked to the media which is hosted on 3rd party services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tv_Player;
