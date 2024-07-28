import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '55d35f3b59c4c3c466fa966523151399';
const BASE_URL = 'https://api.themoviedb.org/3';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

interface SearchBarProps {
  onMoviesFound: (movies: Movie[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onMoviesFound }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);

  useEffect(() => {
    if (query.length > 0) {
      const fetchMovies = async () => {
        const response = await axios.get(`${BASE_URL}/search/movie`, {
          params: {
            api_key: API_KEY,
            query: query,
          },
        });
        setResults(response.data.results);
        onMoviesFound(response.data.results);
      };

      fetchMovies();
    } else {
      setResults([]);
      onMoviesFound([]);
    }
  }, [query, onMoviesFound]);

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies..."
      />
    </div>
  );
};

export default SearchBar;
