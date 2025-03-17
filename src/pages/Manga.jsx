import React from 'react';
import MangaFetch from '../components/MangaFetch';

const Manga = () => {
  return (
    <div className="ml-5 max-md:-ml-9 max-md:mr-3 bg-[#121212] rounded-2xl mr-3">
      <div className="p-4">
        <span className="underline text-2xl ml-1 mb-4 max-md:text-lg block">
          Recently Updated
        </span>
        <MangaFetch />
      </div>
    </div>
  );
};

export default Manga;
