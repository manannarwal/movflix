import React, { useEffect, useState, useRef, useCallback } from "react";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

const Tvshowfetch = () => {
  const [tvShows, setTvShows] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef();
  const navigate = useNavigate();
  const MAX_PAGES = 10;

  const fetchTvShows = async (pageNumber) => {
    if (pageNumber > MAX_PAGES) {
      setHasMore(false);
      return;
    }

    setLoading(true);
    try {
      const apiKey = "014463e32f320e61f3c8248c6db9ee80";
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&page=${pageNumber}`;
      const response = await fetch(url);
      const data = await response.json();

      setTvShows((prev) => [...prev, ...data.results]);
      if (pageNumber >= data.total_pages || pageNumber >= MAX_PAGES) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching TV shows:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTvShows(page);
  }, [page]);

  const observerCallback = useCallback((node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="mb-3.5">
      <span className="absolute ml-3 mt-4 text-xl">{`${tvShows.length}`} Results</span>
      <div className="mr-0.5 pt-15 flex flex-wrap gap-4 bg-[#121212] rounded-2xl pb-3 justify-center items-center">
        {tvShows.map((tv, index) => {
          const title = tv.name || tv.title || "Untitled";

          if (index === tvShows.length - 1) {
            return (
              <div
                ref={observerCallback}
                key={tv.id}
                onClick={() => navigate(`/tv/${tv.id}`)}
              >
                <Card
                  poster={tv.poster_path || null}
                  title={title}
                  rating={tv.vote_average}
                />
              </div>
            );
          } else {
            return (
              <div key={tv.id} onClick={() => navigate(`/tv/${tv.id}`)}>
                <Card
                  poster={tv.poster_path}
                  title={title}
                  rating={tv.vote_average}
                />
              </div>
            );
          }
        })}
        
        {/* Disclaimer */}
        <div className="w-full mt-8 mx-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-center max-md:mt-6 max-md:p-3">
          <p className="text-gray-400 text-sm max-md:text-xs">
            This site does not store any files on the server, we only linked to the media which is hosted on 3rd party services.
          </p>
        </div>
      </div>
      {loading && <p className="text-center text-gray-400 mt-5">Loading...</p>}
    </div>
  );
};

export default Tvshowfetch;
