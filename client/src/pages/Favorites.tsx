import React, { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../services/movieService';
import MovieCard from '../components/MovieCard';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]').filter(Boolean);
    console.log('Saved favorites:', savedFavorites);

    Promise.all(savedFavorites.map((id: string) => fetchMovieDetails(id)))
      .then(movies => {
        console.log('Fetched movie details:', movies);
        const validMovies = movies.filter(movie => movie && movie.id);
        setFavorites(validMovies);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movie details:', error);
        setLoading(false);
      });
  }, []);

  const removeFavorite = (id: string) => {
    const updatedFavorites = favorites.filter(movie => movie.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites.map(movie => movie.id)));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movies-container">
      {favorites.map((movie, index) => (
        <MovieCard
          key={`${movie.id}-${index}`}
          movie={movie}
          isFavorite={true}
          toggleFavorite={removeFavorite}
        />
      ))}
    </div>
  );
};

export default Favorites;
