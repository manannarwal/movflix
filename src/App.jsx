import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Menu2 from "./components/Menu2";
import Movies from "./pages/Movie";
import Anime from "./pages/Anime";
import TvShow from "./pages/Tvshow";
import LiveTv from "./pages/LiveTv";
import Manga from "./pages/Manga";
import Pop_Movie from "./components/Popular_Movie";
import Mov_Player from "./components/Mov_Player";
import Tv_Player from "./components/Tv_Player";
import Search from "./components/Search";
import Home from "./pages/Home";



const App = () => {
  return (
    <Router>
      <div className="flex">
        <div className="fixed my-21  left-0 h-screen">
          <Menu2 />
        </div>

        {/* Main Content */}
        <div className="ml-[13vw] w-full min-h-screen scroll-smooth">
          <Navbar />
          <div className="pt-[5.5rem]">
            <Routes>
              
              <Route
                path="/"
                element={
                  <div >
                    <Home />
                  </div>
                }
              />
              <Route path="/" element={<Search />} />
              <Route path="/player/:id" element={<Mov_Player />} />
              <Route path="/tv/:id" element={<Tv_Player />} />
              
              <Route path="/movies" element={<Movies />} />
              <Route path="/anime" element={<Anime />} />
              <Route path="/tvshows" element={<TvShow />} />
              <Route path="/livetv" element={<LiveTv />} />
              <Route path="/manga" element={<Manga />} />
            </Routes>
          </div>
        </div>
      </div>
        <span className="hidden max-md:bottom-0 max-md:bg-[#121212] max-md:flex max-md:items-center max-md:justify-center max-md:rounded-xl max-md:mx-3 max-md:pt-2 max-md:mb-3">
          Made with ❤️<span> by <a href="https://manannarwal.me" target="blank"> Manan</a></span>
        </span>
    </Router>
  );
};

export default App;
