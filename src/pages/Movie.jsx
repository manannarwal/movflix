import React from 'react'
import Movie_Fetch from '../components/movies/Movie_Fetch'
import Trending_Movie from '../components/movies/Trending_Movie'
import Popular_Movie from '../components/movies/Popular_Movie'

const movie = () => {
  return (
    <div className="ml-5 mr-3 pb-3 bg-[#121212] rounded-2xl mb-3 max-md:-ml-10">
      <Movie_Fetch />
      <p className='pl-4 text-2xl mt-4 underline'>Trending Movies</p>
      <Trending_Movie />
      <p className='pl-4 text-2xl mt-5 underline'>Popular Movies</p>
      <Popular_Movie />
      
      {/* Disclaimer */}
      <div className="mt-8 mx-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-center max-md:mt-6 max-md:p-3">
        <p className="text-gray-400 text-sm max-md:text-xs">
          This site does not store any files on the server, we only linked to the media which is hosted on 3rd party services.
        </p>
      </div>
    </div>
  )
}

export default movie