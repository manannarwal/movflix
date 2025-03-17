import React from "react";
import { useNavigate } from "react-router-dom";

const MangaCard = ({ manga }) => {
  const navigate = useNavigate();

  const coverImage = manga.relationships?.find(
    (rel) => rel.type === "cover_art" && rel.attributes?.fileName
  )?.attributes?.fileName;

  const coverUrl = coverImage
    ? `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://uploads.mangadex.org/covers/${manga.id}/${coverImage}`)}`

    : "/placeholder.jpg";

  return (
    <div
      key={manga.id}
      className={`w-40 rounded-xl overflow-hidden shadow-lg flex flex-col ml-1 relative transition-transform duration-300 cursor-pointer hover:scale-105`}
      onClick={() => navigate(`/manga/${manga.id}`)}
    >
      <img
        src={coverUrl}
        alt={manga.attributes.title?.en || "No Title"}
        className="w-full h-56 object-cover"
        onError={(e) => (e.target.src = "/placeholder.jpg")}
      />
      <div className="p-2 flex-grow">
        <h3
          className="text-white text-sm font-bold truncate -ml-2 font-sans"
          title={manga.attributes.title?.en || "Untitled"}
        >
          {manga.attributes.title?.en || "Untitled"}
        </h3>
      </div>
    </div>
  );
};

export default MangaCard;
