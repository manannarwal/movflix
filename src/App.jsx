import React from "react";
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import Menu2 from "./components/Menu2";
import Movies from "./pages/Movie";
import Anime from "./pages/Anime";
import TvShow from "./pages/Tvshow";
import LiveTv from "./pages/LiveTv";
import Manga from "./pages/Manga";
import Connect from "./pages/Connect";
import Mov_Player from "./components/movies/Mov_Player";
import Tv_Player from "./components/tvshows/Tv_Player";
import Anime_Player from "./components/anime/Anime_Player";
import Search from "./components/Search";
import Home from "./pages/Home";
import MangaCover from "./components/manga/MangaCover";
import MangaScan from "./components/manga/MangaScan";
import { initializeConsoleFilter } from "./utils/consoleManager";



const AppContent = () => {
  const navigate = useNavigate();

  // Initialize console filtering for third-party spam
  useEffect(() => {
    const cleanupConsoleFilter = initializeConsoleFilter();
    
    // Cleanup function to restore original console methods
    return cleanupConsoleFilter;
  }, []);

  useEffect(() => {
    const notificationCount = parseInt(localStorage.getItem('animeNotificationCount') || '0', 10);
    const sessionShown = sessionStorage.getItem('animeNotificationShownThisSession');
    
    // Only show if count is less than 25 AND hasn't been shown this session
    if (notificationCount < 25 && !sessionShown) {
      const timer = setTimeout(() => {
        toast.success("Anime Section Launched! Dive into thousands of episodes now!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClick: () => {
            navigate('/anime');
          },
        });
        
        // Increment the count
        const newCount = notificationCount + 1;
        localStorage.setItem('animeNotificationCount', newCount.toString());
        
        // Mark as shown for this session
        sessionStorage.setItem('animeNotificationShownThisSession', 'true');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-black relative">
      
      <div className="fixed my-21  left-0 h-screen z-10">
        <Menu2 />
      </div>

      {/* Main Content */}
      <div className="ml-[13vw] w-full min-h-screen scroll-smooth relative z-0">
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
            <Route path="/anime-player/:id" element={<Anime_Player />} />
            <Route path="/manga/:id" element={<MangaCover />} />
            <Route path="/manga/:mangaId/chapter/:chapterId" element={<MangaScan />} />
            
            
            <Route path="/movies" element={<Movies />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/tvshows" element={<TvShow />} />
            <Route path="/livetv" element={<LiveTv />} />
            <Route path="/manga" element={<Manga />} />
            <Route path="/connect" element={<Connect />} />
          </Routes>
        </div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: 'rgba(18, 18, 18, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          color: 'white',
          cursor: 'pointer',
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
