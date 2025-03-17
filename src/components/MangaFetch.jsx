import React, { useEffect, useState } from "react";
import MangaCard from "./MangaCard";
import { useNavigate } from "react-router-dom";

const MangaFetch = () => {
  const [manga, setManga] = useState([]);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const getManga = async () => {
    try {
      let allResults = [];
      const limit = 20;
      let offset = 0;
  
      for (let i = 0; i < 2; i++) {
        const response = await fetch(
          `https://api.mangadex.org/manga?limit=${limit}&offset=${offset}&includes[]=cover_art`
        );
        const data = await response.json();
        allResults = [...allResults, ...data.data];
        offset += limit;
      }
  
      setManga(allResults);
      setCount(allResults.length);
    } catch (error) {
      console.log("Error Fetching Data", error);
    }
  };

  useEffect(() => {
    getManga();
  }, []);

  return (
    <div className="mb-3.5">
      <div className=" pt-5 flex flex-wrap gap-3 pb-3 justify-center items-center">
        {manga.map((m) => (
          <div key={m.id} onClick={() => navigate(`/manga/${m.id}`)}>
            <MangaCard manga={m} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MangaFetch;
