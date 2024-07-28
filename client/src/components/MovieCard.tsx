import React from "react";

interface Genre {
  id: number;
  name: string;
}

interface MovieCardProps {
  movie: any;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
  genres: Genre[];
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavorite,
  toggleFavorite,
  genres,
}) => {
  if (!movie) return null;

  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map((id) => {
        const genre = genres.find((g) => g.id === id);
        return genre ? genre.name : "";
      })
      .join(", ");
  };

  return (
    <div className="movie-card">
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title || "No Title Available"}
        />
      ) : (
        <div>No Image Available</div>
      )}
      <h3>{movie.title || "No Title Available"}</h3>
      <p>
        {movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : "No Release Date Available"}
      </p>
      <p>
        {movie.genre_ids
          ? getGenreNames(movie.genre_ids)
          : "No Genres Available"}
      </p>
      <p>
        <strong>Rating</strong>
        {movie.vote_average !== undefined
          ? movie.vote_average
          : "No Rating Available"}
      </p>
      <button onClick={() => toggleFavorite(movie.id)}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
};

export default MovieCard;
