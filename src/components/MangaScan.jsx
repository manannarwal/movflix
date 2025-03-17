import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MangaScan = () => {
  const { mangaId, chapterId } = useParams();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchChapterPages = async () => {
      try {
        // Fetch chapter data
        const response = await fetch(
          `https://api.mangadex.org/at-home/server/${chapterId}`
        );
        const data = await response.json();
        const baseUrl = data.baseUrl;
        const hash = data.chapter.hash;
        const dataSaverPages = data.chapter.dataSaver;

        // Generate page URLs
        const pageUrls = dataSaverPages.map(
          (page) => `${baseUrl}/data-saver/${hash}/${page}`
        );
        setPages(pageUrls);
      } catch (error) {
        console.error("Error fetching chapter pages:", error);
      }
    };

    fetchChapterPages();
  }, [mangaId, chapterId]);

  if (!pages.length) {
    return (
      <div className="flex justify-center items-center text-2xl bg-[#121212] h-screen w-screen ml-5 rounded-2xl pr-100 text-white">
        Loading pages...
      </div>
    );
  }
  

  return (
    <div className="p-4 bg-[#121212] text-white min-h-screen rounded-2xl ml-5 mr-3 mb-3 ">
      <div className="flex flex-col items-center gap-4">
        {pages.map((page, index) => (
          <img
            key={index}
            src={page}
            alt={`Page ${index + 1}`}
            className="max-w-full rounded-lg shadow-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default MangaScan;
