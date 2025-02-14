import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Menu2 from "./components/Menu2";
import Movies from "./pages/Movie";
import Anime from "./pages/Anime";
import TvShow from "./pages/Tvshow";
import LiveTv from "./pages/LiveTv";
import Manga from "./pages/Manga";
import Slider from "./components/Slider";
import Pop_Movie from "./components/Popular_Movie";
import Toprated_Movie from "./components/Toprated_Movie";
import Upcoming_Movies from "./components/Upcoming_Movies";
import Mov_Player from "./components/Mov_Player";
import Tv_Player from "./components/Tv_Player";
import Tvshowfetch from "./components/Tvshowfetch";
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
    </Router>
  );
};

export default App;
