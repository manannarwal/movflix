import React, { useState, useEffect } from "react";
import { MdImageNotSupported } from "react-icons/md";

const MangaSearchFetch = ({ query, onResults, onSelect }) => {
  const [mangas, setMangas] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setMangas([]);
        onResults([]);
        return;
      }

      try {
        const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.mangadex.org/manga?title=${query}&limit=5&includes[]=cover_art`)}`;
        const response = await fetch(url);
        const data = await response.json();

        const mangaResults = data.data.map((manga) => ({
          id: manga.id,
          title: manga.attributes.title?.en || "Unknown Title",
          poster_path: manga.relationships?.find(
            (rel) => rel.type === "cover_art"
          )?.attributes?.fileName,
        }));

        setMangas(mangaResults);
        onResults(mangaResults);
      } catch (error) {
        console.error("Error fetching manga search results:", error);
        setMangas([]);
        onResults([]);
      }
    };

    fetchResults();
  }, [query, onResults]);

  return (
    mangas.length > 0 && (
      <div className="absolute left-[35vw] w-[30vw] mt-13 bg-[#202020] rounded-xl shadow-lg p-3 text-white max-md:fixed max-md:w-[53vw] max-md:mt-14 max-md:left-[29vw] max-md:text-sm">
        {mangas.map((manga) => (
          <div
            key={manga.id}
            className="flex items-center gap-3 p-2 border-b border-gray-700 hover:bg-[#282828] cursor-pointer"
            onClick={() => onSelect(manga)}
          >
            {/* Poster Image */}
            {manga.poster_path ? (
              <img
                src={`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://uploads.mangadex.org/covers/${manga.id}/${manga.poster_path}.256.jpg`)}`}
                alt={manga.title}
                className="w-12 h-16 rounded-lg"
              />
            ) : (
              <div className="w-12 h-16 bg-zinc-800 rounded-lg flex items-center justify-center">
                <MdImageNotSupported />
              </div>
            )}

            {/* Manga Details */}
            <div>
              <p className="font-semibold">{manga.title}</p>
              <p className="text-gray-400 text-sm">Manga</p>
            </div>
          </div>
        ))}
      </div>
    )
  );
};

export default MangaSearchFetch;
