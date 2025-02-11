import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Mov_Player = () => {
  const { id } = useParams();
  const [SelectedServer, setSelectedServer] = useState("vidlink");

  const serverUrls = {
    vidlink: `https://vidlink.pro/movie/${id}`,
    vidsrc1: `https://vidsrc.in/embed/movie?tmdb=${id}`,
    vidsrc2: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
  }
  return (
    <div>
      <div className="absolute ml-4 pb-21 bg-[#121212] mr-13 rounded-2xl font-sans">
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
        className="rounded-2xl mt-2 mx-1 "
        src={serverUrls[SelectedServer]}
        allowFullScreen
        height={700}
        width={1000}
      ></iframe>
      </div>
    </div>
  );
};

export default Mov_Player;
