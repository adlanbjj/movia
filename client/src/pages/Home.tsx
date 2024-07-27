import React, { useEffect, useState } from "react";
import { fetchMoviesByPage, fetchGenres } from "../services/movieService";
import MovieCard from "../components/MovieCard";

const Home: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<any[]>([]);
  const [filter, setFilter] = useState<{
    genre: string;
    year: string;
    rating: string;
  }>({
    genre: "",
    year: "",
    rating: "",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const [genreData] = await Promise.all([fetchGenres()]);
      setGenres(genreData);
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const data = await fetchMoviesByPage(page, filter);
      setMovies((prevMovies) =>
        page === 1 ? data.results : [...prevMovies, ...data.results]
      );
      setTotalResults(data.total_results);
      setLoading(false);
    };
    fetchMovies();
  }, [page, filter]);

  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(savedFavorites);
  }, []);

  const toggleFavorite = (id: string) => {
    let updatedFavorites;
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter((favId) => favId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
    setPage(1);
  };

  const handleGenreClick = (genreId: string) => {
    setFilter({ ...filter, genre: genreId });
    setPage(1);
  };

  const loadMoreMovies = () => {
    if (movies.length < totalResults && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesGenre = filter.genre
      ? movie.genre_ids.includes(parseInt(filter.genre))
      : true;
    const matchesYear = filter.year
      ? movie.release_date.startsWith(filter.year)
      : true;
    const matchesRating = filter.rating
      ? movie.vote_average >= parseFloat(filter.rating)
      : true;
    return matchesGenre && matchesYear && matchesRating;
  });

  return (
    <div className="home-container">
      <div className="sidebar">
        <h3>Genres</h3>
        <ul>
          {genres.map((genre) => (
            <li
              key={genre.id}
              onClick={() => handleGenreClick(genre.id.toString())}
            >
              {genre.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <div className="filters">
          <select name="year" value={filter.year} onChange={handleFilterChange}>
            <option value="">All Years</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
            <option value="2017">2017</option>
            <option value="2016">2016</option>
            <option value="2015">2015</option>
            <option value="2014">2014</option>
            <option value="2013">2013</option>
            <option value="2012">2012</option>
            <option value="2011">2011</option>
            <option value="2010">2010</option>
            <option value="2009">2009</option>
            <option value="2008">2008</option>
            <option value="2007">2007</option>
            <option value="2006">2006</option>
            <option value="2005">2005</option>
            <option value="2004">2004</option>
            <option value="2003">2003</option>
            <option value="2002">2002</option>
            <option value="2001">2001</option>
            <option value="2000">2000</option>
            <option value="1999">1999</option>
            <option value="1998">1998</option>
            <option value="1997">1997</option>
            <option value="1996">1996</option>
            <option value="1995">1995</option>
            <option value="1994">1994</option>
            <option value="1993">1993</option>
            <option value="1992">1992</option>
            <option value="1991">1991</option>
            <option value="1990">1990</option>
            <option value="1989">1989</option>
            <option value="1988">1988</option>
            <option value="1987">1987</option>
            <option value="1986">1986</option>
            <option value="1985">1985</option>
            <option value="1984">1984</option>
            <option value="1983">1983</option>
            <option value="1982">1982</option>
            <option value="1981">1981</option>
            <option value="1980">1980</option>
          </select>
          <select
            name="rating"
            value={filter.rating}
            onChange={handleFilterChange}
          >
            <option value="">All Ratings</option>
            <option value="8">8 and above</option>
            <option value="7">7 and above</option>
            <option value="6">6 and above</option>
          </select>
        </div>
        <div className="movies-container">
          {filteredMovies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              movie={movie}
              isFavorite={favorites.includes(movie.id)}
              toggleFavorite={toggleFavorite}
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
