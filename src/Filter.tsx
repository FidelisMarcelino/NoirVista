import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addFavorite, isFavorite, removeFavorites } from "./favoriteUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";

type Genre = {
  id: number;
  name: string;
};

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

export default function Filter() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<any[]>([]);
  const [, setSelectedGenre] = useState<number | null>(null);

  const [favorite, setFavorite] = useState(false);

  const toggleFavorite = (movieId: number, movieData: any) => {
    if (isFavorite(movieId)) {
      removeFavorites(movieId);
    } else {
      addFavorite(movieData);
    }

    setFavorite(!favorite);
  };

  const fetchAllMovies = async () => {
    try {
      const pagesToFetch = [1, 2, 3];
      let allMovies: any[] = [];

      for (const page of pagesToFetch) {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${page}&region=ID`
        );
        allMovies = [...allMovies, ...res.data.results];
      }

      setNowPlayingMovies(allMovies);
    } catch (err) {
      console.error("Error fetching all movies:", err);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await axios.get(
        "https://api.themoviedb.org/3/genre/movie/list?api_key=a777627566d2e4cc9e4af010e47779da&language=en"
      );
      setGenres(res.data.genres);
    } catch (err) {
      console.error("Gagal fetch genre:", err);
    }
  };

  const fetchMoviesByGenre = async (genreId: number) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=a777627566d2e4cc9e4af010e47779da&with_genres=${genreId}&region=ID`
      );

      setNowPlayingMovies(response.data.results);
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  const truncate = (text: string, maxWords: number) => {
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + " ...";
  };

  useEffect(() => {
    fetchGenres();
    fetchAllMovies();
  }, []);

  return (
    <>
      <div className="flex justify-center">
        <select
          className="p-2 bg-black text-white rounded cursor-pointer"
          onChange={(e) => {
            const genreId = Number(e.target.value);

            if (!genreId) {
              setSelectedGenre(null);
              fetchAllMovies();
              return;
            }

            setSelectedGenre(genreId);
            fetchMoviesByGenre(genreId);
          }}
        >
          <option value="">All Genre</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 mt-4">
        {nowPlayingMovies.map((movie: any) => (
          <Link to={`/detail/${movie.id}`}>
            <div
              key={movie.id}
              className="relative bg-[#1a1a1a] p-3 rounded-lg text-white h-90 flex flex-col"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-lg mb-2"
              />
              <h3 className="font-bold text-lg">{truncate(movie.title, 5)}</h3>
              <p className="text-sm opacity-70">{movie.release_date}</p>

              <div>
                <button
                  className="absolute top-3 left-1 cursor-pointer z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(movie.id, movie);
                  }}
                >
                  <FontAwesomeIcon
                    icon={isFavorite(movie.id) ? fasBookmark : farBookmark}
                    className="text-3xl"
                  />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
