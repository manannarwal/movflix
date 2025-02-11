import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Tv_Player = () => {
  const { id } = useParams();
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [SelectedServer, setSelectedServer] = useState("vidlink");

  // Fetch seasons for the selected TV show
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const apiKey = "014463e32f320e61f3c8248c6db9ee80";
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`
        );
        const data = await response.json();

        const seasonList = data.seasons.map((season) => season.season_number);
        setSeasons(seasonList);
      } catch (error) {
        console.log("Error fetching seasons:", error);
      }
    };

    fetchSeasons();
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

        const episodeList = data.episodes.map((ep) => ep.episode_number);
        setEpisodes(episodeList);
      } catch (error) {
        console.log("Error fetching episodes:", error);
      }
    };

    fetchEpisodes();
  }, [id, selectedSeason]);

  const serverUrls = {
    vidlink: `https://vidlink.pro/tv/${id}/${selectedSeason}/${selectedEpisode}`,
    vidsrc1: `https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`,
    vidsrc2: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode}`,
  };

  return (
    <div className="bg-[#121212] pb-23 rounded-2xl mx-4 font-sans">
      {/* Season & Episode Selection */}
      <div className="flex gap-4 mb-2">
        {/* Season Dropdown */}
        <div className="absolute my-213 mx-8">
          <label className="text-white mr-2">Season:</label>
          <select
            className=" bg-gray-800 text-white p-2 rounded-xl"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
          >
            {seasons.map((season) => (
              <option key={season} value={season}>
                Season {season}
              </option>
            ))}
          </select>
        </div>

        {/* Episode Dropdown */}
        <div className="absolute my-213 mx-50">
          <label className="text-white ml-5 mr-2">Episode:</label>
          <select
            className="bg-gray-800 text-white p-2 rounded-xl"
            value={selectedEpisode}
            onChange={(e) => setSelectedEpisode(Number(e.target.value))}
          >
            {episodes.map((episode) => (
              <option key={episode} value={episode}>
                Episode {episode}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="absolute  mx-390">
        <label className="absolute my-213 text-white">Server:</label>
        <select
          className="absolute bg-gray-800 my-211 ml-15 text-white p-2 rounded-xl"
          value={SelectedServer}
          onChange={(e) => setSelectedServer(e.target.value)}
        >
          <option value="vidlink">Primary</option>
          <option value="vidsrc1">Secondary</option>
          <option value="vidsrc2">Backup</option>
        </select>
      </div>

      {/* Video Player */}
      <iframe
        className="rounded-2xl mx-1 "
        src={serverUrls[SelectedServer]}
        allowFullScreen
        height={600}
        width={1000}
      ></iframe>
    </div>
  );
};

export default Tv_Player;
