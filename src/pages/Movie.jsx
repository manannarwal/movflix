import React from 'react'
import Movie_Fetch from '../components/Movie_Fetch'
import Trending_Movie from '../components/Trending_Movie'
import Popular_Movie from '../components/Popular_Movie'

const movie = () => {
  return (
    <div className="ml-5 mr-3 pb-3 bg-[#121212] rounded-2xl mb-3 max-md:-ml-10">
      <Movie_Fetch />
      <p className='pl-4 text-2xl mt-4 underline'>Trending Movies</p>
      <Trending_Movie />
      <p className='pl-4 text-2xl mt-5 underline'>Popular Movies</p>
      <Popular_Movie />
    </div>
  )
}

export default movie