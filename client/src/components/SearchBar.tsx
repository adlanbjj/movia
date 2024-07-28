import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
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

  const memoizedOnMoviesFound = useCallback(onMoviesFound, []);

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
        memoizedOnMoviesFound(response.data.results);
      };

      fetchMovies();
    } else {
      setResults([]);
      memoizedOnMoviesFound([]);
    }
  }, [query, memoizedOnMoviesFound]);

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
