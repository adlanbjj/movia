import axios, { AxiosRequestConfig } from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
}

interface Genre {
  id: number;
  name: string;
}

interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface GenreResponse {
  genres: Genre[];
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

const fetchWithRetry = async <T>(url: string, params: AxiosRequestConfig['params'], retries = 3, delay = 1000): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(url, { params });
    return response.data;
  } catch (error) {
    if (retries > 0 && (error as any).code === 'ERR_NETWORK') {
      console.warn(`Retrying... attempts left: ${retries}`);
      await new Promise(res => setTimeout(res, delay));
      return fetchWithRetry<T>(url, params, retries - 1, delay * 2);
    } else {
      throw error;
    }
  }
};

export const fetchMoviesByPage = async (page: number, filter: { genre: string; year: string; rating: string }): Promise<MoviesResponse> => {
  try {
    const data = await fetchWithRetry<MoviesResponse>('/discover/movie', {
      page,
      with_genres: filter.genre || undefined,
      primary_release_year: filter.year || undefined,
      'vote_average.gte': filter.rating || undefined,
    });
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { results: [], total_results: 0, page: 0, total_pages: 0 };
  }
};

export const fetchMovieDetails = async (id: string): Promise<Movie | null> => {
  try {
    const data = await fetchWithRetry<Movie>(`/movie/${id}`, {});
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const data = await fetchWithRetry<GenreResponse>('/genre/movie/list', {});
    return data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};
