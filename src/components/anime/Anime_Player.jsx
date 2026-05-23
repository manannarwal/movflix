import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { HiOutlineServerStack } from "react-icons/hi2";
import { BiSolidMoviePlay } from "react-icons/bi";
import { getAnilistInfoById, getMegaPlayUrl } from "../../utils/anilistApi";

const Anime_Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("sub");
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [animeData, setAnimeData] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [streamUrl, setStreamUrl] = useState("");
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  const languageOptions = [
    { value: "sub", label: "Subtitled" },
    { value: "dub", label: "Dubbed" },
  ];

  // Load saved state from localStorage
  useEffect(() => {
    if (episodes.length > 0) {
      const savedData = localStorage.getItem(`anime_${id}`);
      if (savedData) {
        const { episode, language } = JSON.parse(savedData);
        if (episode && episodes.find(ep => ep.number === episode)) {
          setSelectedEpisode(episode);
        } else {
          setSelectedEpisode(episodes[0].number);
        }
        if (language) setSelectedLanguage(language);
      } else {
        setSelectedEpisode(episodes[0].number);
      }
    }
  }, [id, episodes]);

  // Save to localStorage
  useEffect(() => {
    if (episodes.length > 0 && selectedEpisode > 0) {
      localStorage.setItem(
        `anime_${id}`,
        JSON.stringify({ episode: selectedEpisode, language: selectedLanguage })
      );
    }
  }, [id, selectedEpisode, selectedLanguage, episodes]);

  // Fetch anime data
  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        setAnimeData(null);
        setEpisodes([]);
        setStreamUrl("");
        setIsLoading(true);

        const info = await getAnilistInfoById(id);
        setAnimeData(info);

        if (info.totalEpisodes && info.totalEpisodes > 0) {
          const episodesList = Array.from({ length: info.totalEpisodes }, (_, i) => ({
            number: i + 1,
          }));
          setEpisodes(episodesList);
        }
      } catch (error) {
        console.error("Error fetching anime data:", error);
      }
    };

    if (id) {
      fetchAnimeData();
    }
  }, [id]);

  // Update stream URL when episode or language changes
  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    const url = getMegaPlayUrl(id, selectedEpisode, selectedLanguage);
    setStreamUrl(url);
    setIsLoading(false);
  }, [id, selectedEpisode, selectedLanguage]);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleEpisodeChange = (episodeNum) => {
    setSelectedEpisode(episodeNum);
  };

  const goToPreviousEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.number === selectedEpisode);
    if (currentIndex > 0) {
      handleEpisodeChange(episodes[currentIndex - 1].number);
    }
  };

  const goToNextEpisode = () => {
    const currentIndex = episodes.findIndex(ep => ep.number === selectedEpisode);
    if (currentIndex < episodes.length - 1) {
      handleEpisodeChange(episodes[currentIndex + 1].number);
    }
  };

  return (
    <div className="min-h-screen ml-4 mb-4 overflow-hidden max-md:-ml-10 max-md:mb-2">
      <div className="mr-3 bg-[#121212] rounded-2xl border border-white/5 shadow-lg p-6 max-md:p-4 max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 max-md:mb-4 max-md:flex-col max-md:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 transition-all px-4 py-2 rounded-xl border border-white/20 max-md:w-full max-md:justify-center"
          >
            <MdArrowBack className="text-xl" />
            <span>Back</span>
          </button>
          {animeData && (
            <h1 className="text-2xl md:text-3xl font-bold text-white max-md:text-xl">
              {animeData.title}
            </h1>
          )}
          <div className="w-20 max-md:hidden"></div>
        </div>

        {/* Player Container */}
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

            {streamUrl ? (
              <iframe
                src={streamUrl}
                className="w-full border-0 rounded-t-2xl"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title={`${animeData?.title || 'Anime'} - Episode ${selectedEpisode}`}
                frameBorder="0"
                scrolling="no"
                style={{
                  height: '70vh',
                  minHeight: '400px',
                }}
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-900 rounded-t-2xl" style={{ height: '70vh', minHeight: '400px' }}>
                <div className="text-center">
                  <BiSolidMoviePlay size={64} className="mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-semibold mb-2 text-white">Loading...</h3>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 space-y-4 max-md:p-4 max-md:space-y-3">
            {/* Episode Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousEpisode}
                disabled={selectedEpisode === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all border disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
              >
                <MdSkipPrevious className="text-lg" />
                <span className="max-md:hidden">Previous</span>
              </button>

              <div className="text-center">
                <p className="text-white font-medium">Episode {selectedEpisode}</p>
              </div>

              <button
                onClick={goToNextEpisode}
                disabled={selectedEpisode === episodes.length}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all border disabled:opacity-50 disabled:cursor-not-allowed bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
              >
                <span className="max-md:hidden">Next</span>
                <MdSkipNext className="text-lg" />
              </button>
            </div>

            {/* Language Selection */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-md:gap-3">
              <div className="flex items-center gap-2 text-white">
                <HiOutlineServerStack className="text-xl" />
                <span className="font-medium">Language:</span>
              </div>
              <div className="flex gap-2">
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleLanguageChange(option.value)}
                    className={`px-4 py-2 rounded-lg transition-all border max-md:px-3 max-md:py-1.5 max-md:text-sm ${
                      selectedLanguage === option.value
                        ? 'bg-white/20 border-white/30 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Episode Selection */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-md:gap-3">
              <div className="flex items-center gap-2 text-white">
                <BiSolidMoviePlay className="text-xl" />
                <span className="font-medium">Episodes:</span>
              </div>
              <div className="flex-1">
                <select
                  value={selectedEpisode}
                  onChange={(e) => handleEpisodeChange(parseInt(e.target.value))}
                  className="w-full sm:w-auto bg-white/5 border-white/10 text-white px-4 py-2 rounded-xl border focus:border-white/30 focus:outline-none hover:bg-white/10"
                >
                  {episodes.map((ep) => (
                    <option key={ep.number} value={ep.number} className="bg-[#121212]">
                      Episode {ep.number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Anime Info */}
            {animeData && (
              <div className="border-t border-white/10 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Overview</h3>
                    <div className="text-gray-300 text-sm leading-relaxed">
                      {animeData.description ? (
                        <>
                          <p>
                            {showFullSynopsis
                              ? animeData.description
                              : `${animeData.description.substring(0, 300)}`}
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

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-white">{animeData.status || 'Ongoing'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Episodes:</span>
                      <span className="text-white">{animeData.totalEpisodes || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Genres:</span>
                      <span className="text-white">{animeData.genres?.slice(0, 3).join(', ') || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rating:</span>
                      <span className="text-white">{animeData.rating ? `${animeData.rating}%` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium mb-1">Viewing Tips</p>
              <p className="text-gray-400 text-sm">
                Use Previous/Next buttons or episode selector to navigate. Your progress is auto-saved.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            Anime content is streamed from third-party sources. We do not host any files.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Anime_Player;
