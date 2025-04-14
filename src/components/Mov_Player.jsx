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
      <div className="absolute ml-4 pb-21 bg-[#121212] mr-13 rounded-2xl font-sans max-md:-ml-9.5 max-md:w-[93.5vw] max-md:pr-10  max-md:h-[89vh] max-[1024px]:w-[84.5vw] min-[1024px]:h-[88vh] min-[1024px]:pb-0">
      <div className="absolute mx-390 max-md:mx-0 min-[1024px]:ml-5 min-[1024px]:-mt-20">
        <label className="absolute top-[83.5vh] text-white max-md:top-[53vh] max-md:ml-3 max-md:text-sm">Server:</label>
        <select
          className="absolute bg-gray-800 top-[83vh] ml-15 text-white p-2 rounded-xl max-md:top-[52vh] max-md:ml-15 text-sm "
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
        className="rounded-2xl mt-2 mx-1 max-md:pl-1 min-[1024px]:mr-10 "
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
