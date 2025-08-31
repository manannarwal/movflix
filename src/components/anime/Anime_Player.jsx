import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdPlayArrow, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { HiOutlineServerStack } from "react-icons/hi2";
import { BiSolidMoviePlay } from "react-icons/bi";
import { getAnimeInfoById, getAnimeEpisodes } from "../../utils/aniwatchApi";

const Anime_Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("sub");
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [animeData, setAnimeData] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisodeId, setCurrentEpisodeId] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  const languageOptions = [
    { value: "sub", label: "Subtitled" },
    { value: "dub", label: "Dubbed" },
  ];

  // Load saved state from localStorage only after episodes are loaded
  useEffect(() => {
    if (episodes.length > 0) {
      const savedData = localStorage.getItem(`anime_${id}`);
      
      if (savedData) {
        const { episode, language } = JSON.parse(savedData);
        
        if (episode && episodes.find(ep => ep.number === episode)) {
          setSelectedEpisode(episode);
          const savedEpisode = episodes.find(ep => ep.number === episode);
          if (savedEpisode) {
            setCurrentEpisodeId(savedEpisode.episodeId);
          }
        } else {
          // If saved episode doesn't exist, default to first episode
          setSelectedEpisode(episodes[0].number);
          setCurrentEpisodeId(episodes[0].episodeId);
        }
        if (language) setSelectedLanguage(language);
      } else {
        // No saved data, default to first episode
        setSelectedEpisode(episodes[0].number);
        setCurrentEpisodeId(episodes[0].episodeId);
      }
    }
  }, [id, episodes]);

  // Save to localStorage on change (only when episodes are loaded)
  useEffect(() => {
    if (episodes.length > 0 && selectedEpisode > 0) {
      const dataToSave = {
        episode: selectedEpisode,
        language: selectedLanguage,
      };
      localStorage.setItem(`anime_${id}`, JSON.stringify(dataToSave));
    }
  }, [id, selectedEpisode, selectedLanguage, episodes]);

  // Fetch anime details and episodes from Aniwatch API
  useEffect(() => {
    const fetchAniwatchData = async () => {
      try {
        // Reset state when fetching new anime
        setAnimeData(null);
        setEpisodes([]);
        setCurrentEpisodeId("");
        setStreamUrl("");
        setIsLoading(true);
        
        const info = await getAnimeInfoById(id);
        setAnimeData(info);
        
        const eps = await getAnimeEpisodes(id);
        setEpisodes(eps);
        
        // Don't set default episode here - let localStorage restoration handle it
        // The localStorage useEffect will run after episodes are set
      } catch (error) {
        console.error("Error fetching anime data:", error);
      }
    };
    
    if (id) {
      fetchAniwatchData();
    }
  }, [id]);

  // Fetch streaming link when episode or language changes
  useEffect(() => {
    if (!currentEpisodeId) return;
    setIsLoading(true);
    
    // Extract the episode ID from the Aniwatch format (e.g., "solo-leveling-season-2-arise-from-the-shadow-19413?ep=131394")
    const match = currentEpisodeId.match(/\?ep=(\d+)/);
    if (match) {
      const hianimeEpId = match[1]; // Extract just the numeric part (e.g., "131394")
      const playerUrl = `https://megaplay.buzz/stream/s-2/${hianimeEpId}/${selectedLanguage}`;
      setStreamUrl(playerUrl);
    } else {
      console.error('Could not extract episode ID from:', currentEpisodeId);
      setStreamUrl("");
    }
    
    setIsLoading(false);
  }, [currentEpisodeId, selectedLanguage]);

  const handleLanguageChange = (language) => {
    setIsLoading(true);
    setSelectedLanguage(language);
  };

  const handleEpisodeChange = (episode) => {
    setIsLoading(true);
    setSelectedEpisode(episode.number);
    setCurrentEpisodeId(episode.episodeId);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    console.error('Failed to load episode stream');
    setIsLoading(false);
  };

  // Navigation helpers
  const goToPreviousEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.number === selectedEpisode);
    if (currentIndex > 0) {
      handleEpisodeChange(episodes[currentIndex - 1]);
    }
  };

  const goToNextEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.number === selectedEpisode);
    if (currentIndex < episodes.length - 1) {
      handleEpisodeChange(episodes[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen ml-4 mb-4 overflow-hidden max-md:-ml-10 max-md:mb-2">
      <div className="mr-3 bg-[#121212] rounded-2xl border border-white/5 shadow-lg p-6 max-md:p-4 max-w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 max-md:mb-4 max-md:flex-col max-md:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 px-4 py-2 rounded-xl border border-white/20 hover:border-white/30 max-md:w-full max-md:justify-center"
          >
            <MdArrowBack className="text-xl" />
            <span className="max-md:inline">Back</span>
          </button>

          {animeData && (
            <div className="text-center max-md:order-first">
              <h1 className="text-2xl md:text-3xl font-bold text-white max-md:text-xl">
                {animeData?.title || animeData?.name || 'Loading Anime...'}
              </h1>
            </div>
          )}

          <div className="w-20 max-md:hidden"></div>
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

            {!streamUrl ? (
              <div className="flex items-center justify-center bg-gray-900 rounded-t-2xl" style={{ height: '70vh', minHeight: '400px' }}>
                <div className="text-center">
                  <BiSolidMoviePlay size={64} className="mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-semibold mb-2 text-white">Stream Not Available</h3>
                  <p className="text-gray-400 mb-4">
                    Episode data is loading or unavailable.<br/>
                    Please try again in a moment.
                  </p>
                </div>
              </div>
            ) : (
              <iframe
                src={streamUrl}
                className="w-full border-0 rounded-t-2xl"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={`${animeData?.title || 'Anime'} - Episode ${selectedEpisode}`}
                referrerPolicy="origin"
                frameBorder="0"
                scrolling="no"
                style={{ 
                  height: '70vh',
                  minHeight: '400px',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              />
            )}
          </div>

          {/* Controls Section */}
          <div className="p-6 space-y-4 max-md:p-4 max-md:space-y-3">
            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousEpisode}
                disabled={selectedEpisode === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 disabled:hover:bg-white/5 max-md:px-3 max-md:py-1.5"
              >
                <MdSkipPrevious className="text-lg" />
                <span className="max-md:text-sm">Previous</span>
              </button>

              <div className="text-center">
                <p className="text-white font-medium max-md:text-sm">Episode {selectedEpisode}</p>
                <p className="text-gray-400 text-sm max-md:text-xs">
                  {episodes.find(ep => ep.number === selectedEpisode)?.title || 'Loading...'}
                </p>
              </div>

              <button
                onClick={goToNextEpisode}
                disabled={selectedEpisode === episodes.length}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 disabled:hover:bg-white/5 max-md:px-3 max-md:py-1.5"
              >
                <span className="max-md:text-sm">Next</span>
                <MdSkipNext className="text-lg" />
              </button>
            </div>

            {/* Language Selection */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-md:gap-3">
              <div className="flex items-center gap-2 text-white">
                <HiOutlineServerStack className="text-xl text-gray-400 max-md:text-lg" />
                <span className="font-medium max-md:text-sm">Language:</span>
              </div>
              
              <div className="flex flex-wrap gap-2 max-md:gap-1.5">
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleLanguageChange(option.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border max-md:px-3 max-md:py-1.5 max-md:text-sm ${
                      selectedLanguage === option.value
                        ? 'bg-white/20 border-white/30 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Episode Selection */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-md:gap-3">
              <div className="flex items-center gap-2 text-white">
                <BiSolidMoviePlay className="text-xl text-gray-400 max-md:text-lg" />
                <span className="font-medium max-md:text-sm">Episodes:</span>
              </div>
              
              <div className="flex-1">
                <select
                  value={selectedEpisode}
                  onChange={(e) => {
                    const episodeNum = parseInt(e.target.value);
                    const episode = episodes.find(ep => ep.number === episodeNum);
                    if (episode) handleEpisodeChange(episode);
                  }}
                  className="w-full sm:w-auto bg-white/5 border-white/10 text-white px-4 py-2 rounded-xl border focus:border-white/30 focus:outline-none hover:bg-white/10 transition-all duration-300 max-md:px-3 max-md:py-1.5 max-md:text-sm"
                >
                  {episodes.map((ep) => (
                    <option key={ep.episodeId} value={ep.number} className="bg-[#121212]">
                      Episode {ep.number} - {ep.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Anime Information */}
            {animeData && (
              <div className="border-t border-white/10 pt-4 max-md:pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-md:gap-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2 max-md:text-sm max-md:mb-1">Overview</h3>
                    <div className="text-gray-300 text-sm leading-relaxed max-md:text-xs">
                      {animeData.description ? (
                        <>
                          <p>
                            {showFullSynopsis 
                              ? animeData.description 
                              : `${animeData.description.substring(0, 300)}`
                            }
                            {animeData.description.length > 300 && (
                              <button
                                onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                                className="ml-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                              >
                                {showFullSynopsis ? 'Show less' : 'Show more'}
                              </button>
                            )}
                          </p>
                        </>
                      ) : (
                        <p>No synopsis available.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-md:space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 max-md:text-xs">Status:</span>
                      <span className="text-white max-md:text-xs">
                        {animeData.status || animeData.airingStatus || animeData.aired || 'Ongoing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 max-md:text-xs">Episodes:</span>
                      <span className="text-white max-md:text-xs">
                        {animeData.totalEpisodes || animeData.episodes || episodes.length || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 max-md:text-xs">Genres:</span>
                      <span className="text-white max-md:text-xs">
                        {animeData.genres?.slice(0, 3).join(', ') || 
                         animeData.genre?.slice(0, 3).join(', ') || 
                         'Action, Adventure'}
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
              <p className="text-white font-medium mb-1 max-md:text-sm max-md:mb-0.5">Viewing Tips</p>
              <p className="text-gray-400 text-sm max-md:text-xs">
                Use the Previous/Next buttons or episode grid to navigate. Switch between Sub/Dub as available. 
                Your progress is automatically saved.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-center max-md:mt-4 max-md:p-3">
          <p className="text-gray-400 text-sm max-md:text-xs">
            Anime Content is streamed from third-party sources. We do not host any files on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Anime_Player;
