import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

interface NavbarProps {
  onMoviesFound: (movies: any[]) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMoviesFound }) => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/favorites">Favorites</Link>
      <SearchBar onMoviesFound={onMoviesFound} />

    </nav>
  );
};

export default Navbar;
