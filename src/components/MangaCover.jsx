import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MangaCover = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [artists, setArtists] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await fetch(
          `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.mangadex.org/manga/${id}?includes[]=cover_art`)}`
        );
        const data = await response.json();
        setManga(data.data);

        // Fetch author and artist details directly from relationships
        const authorIds = data.data.relationships
          .filter((rel) => rel.type === "author")
          .map((rel) => rel.id);
        const artistIds = data.data.relationships
          .filter((rel) => rel.type === "artist")
          .map((rel) => rel.id);

        // Fetch author and artist data in parallel
        if (authorIds.length) {
          const authorsData = await Promise.all(
            authorIds.map(async (authorId) => {
              const res = await fetch(
                `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.mangadex.org/author/${authorId}`)}`
              );
              const author = await res.json();
              return author.data?.attributes?.name;
            })
          );
          setAuthors(authorsData.filter(Boolean));
        }

        if (artistIds.length) {
          const artistsData = await Promise.all(
            artistIds.map(async (artistId) => {
              const res = await fetch(
                `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.mangadex.org/author/${artistId}`)}`
              );
              const artist = await res.json();
              return artist.data?.attributes?.name;
            })
          );
          setArtists(artistsData.filter(Boolean));
        }
      } catch (error) {
        console.error("Error fetching manga details:", error);
      }
    };

    const fetchChapters = async () => {
        let allChapters = [];
        let offset = 0;
        const limit = 100; // Max limit per request
        let hasMore = true;
      
        try {
          while (hasMore) {
            const response = await fetch(
              `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.mangadex.org/manga/${id}/feed?translatedLanguage[]=en&order[chapter]=asc&limit=${limit}&offset=${offset}`)}`
            );
            const data = await response.json();
      
            allChapters = [...allChapters, ...data.data];
            offset += limit;
      
            // If the number of returned items is less than the limit, no more chapters left
            if (data.data.length < limit) {
              hasMore = false;
            }
          }
      
          setChapters(allChapters);
        } catch (error) {
          console.error("Error fetching chapters:", error);
        }
      };
      

    fetchManga();
    fetchChapters();
  }, [id]);

  // Sort chapters
  const sortedChapters = [...chapters].sort((a, b) => {
    const chapterA = parseFloat(a.attributes.chapter) || 0;
    const chapterB = parseFloat(b.attributes.chapter) || 0;
    return sortAscending ? chapterA - chapterB : chapterB - chapterA;
  });

  if (!manga) return <div className="text-2xl">Loading...</div>;

  const coverImage = manga.relationships?.find(
    (rel) => rel.type === "cover_art"
  )?.attributes?.fileName;

  const coverUrl = coverImage
    ? `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://uploads.mangadex.org/covers/${manga.id}/${coverImage}`)}`
    : "/placeholder.jpg";

  const genres = manga.attributes.tags
    ?.filter((tag) => tag.attributes.group === "genre")
    .map((tag) => tag.attributes.name.en)
    .join(", ");

  const themes = manga.attributes.tags
    ?.filter((tag) => tag.attributes.group === "theme")
    .map((tag) => tag.attributes.name.en)
    .join(", ");

  return (
    <div className="p-4 bg-[#121212] text-white min-h-screen rounded-2xl ml-5 mr-3 mb-3 font-serif">
      <div className="flex gap-6">
        {/* Left: Poster */}
        <img
          src={coverUrl}
          alt={manga.attributes.title?.en}
          className="w-60 h-80 object-cover rounded-lg shadow-lg"
        />

        {/* Right: Manga Info */}
        <div>
          <h1 className="text-5xl font-bold mb-2 tracking-tight">
            {manga.attributes.title?.en}
          </h1>
          <p className="text-lg text-gray-400 mb-4">
            {manga.attributes.description?.en || "No description available"}
          </p>

          {/* Author and Artist */}
          <div className="mb-2 flex flex-wrap gap-2">
            <strong className="text-gray-400">Author:</strong>
            <span>{authors.length ? authors.join(", ") : "Unknown"}</span>
          </div>
          <div className="mb-2 flex flex-wrap gap-2">
            <strong className="text-gray-400">Artist:</strong>
            <span>{artists.length ? artists.join(", ") : "Unknown"}</span>
          </div>

          {/* Genres */}
          <div className="mb-2 flex flex-wrap gap-2">
            <strong className="text-gray-400">Genres:</strong>
            <span>{genres || "Not specified"}</span>
          </div>

          {/* Themes */}
          <div className="mb-4 flex flex-wrap gap-2">
            <strong className="text-gray-400">Themes:</strong>
            <span>{themes || "Not specified"}</span>
          </div>
        </div>
      </div>

      {/* Sort Button */}
      <div className="flex justify-between items-center mt-6">
        <h2 className="text-2xl font-semibold">Chapters</h2>
        <button
          className="px-4 py-1 bg-zinc-800 text-white rounded-lg hover:bg-zinc-900 transition"
          onClick={() => setSortAscending(!sortAscending)}
        >
          {sortAscending ? "Sort Descending" : "Sort Ascending"}
        </button>
      </div>

      {/* Chapter List */}
      <ul className="mt-4 space-y-2 font-sans">
        {sortedChapters.map((chapter) => (
          <li
            key={chapter.id}
            className="p-3 bg-zinc-800 hover:bg-zinc-900 rounded-lg cursor-pointer"
            onClick={() =>
              navigate(`/manga/${manga.id}/chapter/${chapter.id}`)
            }
          >
            Chapter {chapter.attributes.chapter || "?"}:{" "}
            {chapter.attributes.title || "No Title"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MangaCover;
