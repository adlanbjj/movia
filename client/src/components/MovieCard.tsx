import React from 'react';

interface MovieCardProps {
  movie: any;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isFavorite, toggleFavorite }) => {
  if (!movie) return null;

  return (
    <div className="movie-card">
      {movie.poster_path ? (
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title || 'No Title Available'} />
      ) : (
        <div>No Image Available</div>
      )}
      <h3>{movie.title || 'No Title Available'}</h3>
      <p>{movie.release_date || 'No Release Date Available'}</p>
      <p>{movie.genre_ids ? movie.genre_ids.join(', ') : 'No Genres Available'}</p>
      <p>{movie.vote_average !== undefined ? movie.vote_average : 'No Rating Available'}</p>
      <button onClick={() => toggleFavorite(movie.id)}>
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
    </div>
  );
};

export default MovieCard;
