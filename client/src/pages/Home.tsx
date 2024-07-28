import React, { useEffect, useState } from 'react';
import { fetchMoviesByPage, fetchGenres } from '../services/movieService';
import MovieCard from '../components/MovieCard';

interface HomeProps {
  searchedMovies: any[];
}

const Home: React.FC<HomeProps> = ({ searchedMovies }) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<any[]>([]);
  const [filter, setFilter] = useState<{ genre: string; year: string; rating: string }>({
    genre: '',
    year: '',
    rating: ''
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const genreData = await fetchGenres();
      setGenres(genreData);
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (searchedMovies.length === 0) {
      const fetchMovies = async () => {
        setLoading(true);
        const data = await fetchMoviesByPage(page, filter);
        setMovies(prevMovies => (page === 1 ? data.results : [...prevMovies, ...data.results]));
        setTotalResults(data.total_results);
        setLoading(false);
      };
      fetchMovies();
    } else {
      setMovies(searchedMovies);
    }
  }, [page, filter, searchedMovies]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const toggleFavorite = (id: string) => {
    let updatedFavorites;
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(favId => favId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
    setPage(1); 
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, genre: e.target.value });
    setPage(1);
  };

  const loadMoreMovies = () => {
    if (movies.length < totalResults && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const filteredMovies = movies.filter(movie => {
    const matchesGenre = filter.genre ? movie.genre_ids.includes(parseInt(filter.genre)) : true;
    const matchesYear = filter.year ? movie.release_date.startsWith(filter.year) : true;
    const matchesRating = filter.rating ? movie.vote_average >= parseFloat(filter.rating) : true;
    return matchesGenre && matchesYear && matchesRating;
  });

  const years = [];
  for (let year = 2021; year >= 1980; year--) {
    years.push(<option key={year} value={year}>{year}</option>);
  }

  return (
    <div className="home-container">
      <div className="sidebar">
        <h3>Genres</h3>
        <ul>
          {genres.map((genre) => (
            <li key={genre.id} onClick={() => setFilter({ ...filter, genre: genre.id.toString() })}>
              {genre.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <div className="filters">
          <select name="year" value={filter.year} onChange={handleFilterChange}>
            <option value="">All Years</option>
            {years}
          </select>
          <select name="rating" value={filter.rating} onChange={handleFilterChange}>
            <option value="">All Ratings</option>
            <option value="8">8 and above</option>
            <option value="7">7 and above</option>
            <option value="6">6 and above</option>
          </select>
          <select name="genre" value={filter.genre} onChange={handleGenreChange} className="mobile-only">
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id.toString()}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <div className="movies-container">
          {filteredMovies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`} 
              movie={movie}
              isFavorite={favorites.includes(movie.id)}
              toggleFavorite={toggleFavorite}
              genres={genres}
            />
          ))}
        </div>
        {loading && <p>Loading...</p>}
        {movies.length < totalResults && (
          <div className="load-more-container">
            <button className="load-more" onClick={loadMoreMovies}>
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
