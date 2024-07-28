import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Navbar from './components/Navbar';
import './App.css';

const App: React.FC = () => {
  const [searchedMovies, setSearchedMovies] = useState<any[]>([]);

  const handleMoviesFound = (movies: any[]) => {
    setSearchedMovies(movies);
  };

  return (
    <Router>
      <Navbar onMoviesFound={handleMoviesFound} />
      <Routes>
        <Route path="/" element={<Home searchedMovies={searchedMovies} />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
};

export default App;
