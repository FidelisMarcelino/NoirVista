import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Card, Carousel } from "antd";
import { Link } from "react-router-dom";
import { addFavorite, isFavorite, removeFavorites } from "./favoriteUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";

function limitSentence(text: string, maxSentences: number) {
  const sentences = text
    .split(".")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length <= maxSentences) {
    return sentences.join(".") + ".";
  }

  return sentences.slice(0, maxSentences).join(".") + "...";
}

function formatTanggal(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function App() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [favorite, setFavorite] = useState(false);

  const popularMovie = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/movie/popular?api_key=a777627566d2e4cc9e4af010e47779da&region=ID"
      );

      setPopularMovies(response.data.results.slice(0, 5));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const nowPlaying = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/movie/now_playing?api_key=a777627566d2e4cc9e4af010e47779da&region=ID"
      );

      setNowPlayingMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const comingSoon = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/movie/upcoming?api_key=a777627566d2e4cc9e4af010e47779da&region=ID"
      );

      setComingSoonMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (movieId: number, movieData: any) => {
    if (isFavorite(movieId)) {
      removeFavorites(movieId);
    } else {
      addFavorite(movieData);
    }

    setFavorite(!favorite);
  };

  useEffect(() => {
    popularMovie();
    nowPlaying();
    comingSoon();
  }, []);

  return (
    <>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <Carousel arrows infinite={true} fade autoplay>
              {popularMovies.map((movie: any) => (
                <div key={movie.id}>
                  <div
                    className="hero"
                    style={{
                      backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                    }}
                  >
                    <div className="overlay">
                      <div className="content">
                        <p className="rating">
                          ⭐ {movie.vote_average.toFixed(1)}
                        </p>
                        <h1 className="title">{movie.title}</h1>
                        <p className="desc">
                          {limitSentence(movie.overview, 2)}
                        </p>

                        <div className="flex gap-5">
                          <Link to={`/detail/${movie.id}`} key={movie.id}>
                            <button className="watch-btn">Watch</button>
                          </Link>

                          <button
                            className="add-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(movie.id, movie);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={
                                isFavorite(movie.id) ? fasBookmark : farBookmark
                              }
                              className="text-lg"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>

            <h1
              className="mt-2 mx-4"
              style={{
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              Now Playing
            </h1>

            <hr
              className="mb-6 mx-4 bg-linear-to-r from-red-500 to-red-0"
              style={{ height: "4px" }}
            />

            {/* Now Playing */}
            <div
              className="mx-4 mb-8 movie-card"
              style={{
                display: "grid",
                gap: "10px",
                gridTemplateColumns: "repeat(4, 1fr)",
              }}
            >
              {nowPlayingMovies.map((movie: any) => (
                <Link to={`/detail/${movie.id}`} key={movie.id}>
                  <Card
                    style={{
                      background: "transparent",
                      border: "none",
                      position: "relative",
                    }}
                    cover={
                      <img
                        draggable={false}
                        alt="movie-backdrop"
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                      />
                    }
                  >
                    <div className="flex justify-between">
                      <div>
                        <h1
                          style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: "white",
                          }}
                        >
                          {movie.title}
                        </h1>

                        <p style={{ color: "white" }}>
                          {movie.release_date.slice(0, 4)} | ⭐{" "}
                          <span>{movie.vote_average.toFixed(1)}</span>{" "}
                        </p>
                      </div>

                      {/* TOMBOL FAVORITE */}
                      <div>
                        <button
                          className="fav-btn ml-3 text-2xl cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(movie.id, movie);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={
                              isFavorite(movie.id) ? fasBookmark : farBookmark
                            }
                            className="text-white"
                          />
                        </button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Upcoming */}
            <h1
              className="mt-2 mx-4"
              style={{
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              Upcoming
            </h1>

            <hr
              className="mb-6 mx-4 bg-linear-to-r from-red-500 to-red-0"
              style={{ height: "4px" }}
            />

            <div
              className="mx-4 mb-8"
              style={{
                display: "grid",
                gap: "10px",
                gridTemplateColumns: "repeat(4, 1fr)",
              }}
            >
              {comingSoonMovies.map((movie: any) => (
                <Link to={`/detail/${movie.id}`} key={movie.id}>
                  <Card
                    style={{
                      background: "transparent",
                      border: "none",
                      position: "relative",
                    }}
                    cover={
                      <img
                        alt="movie-backdrop"
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                      />
                    }
                  >
                    <div className="flex justify-between">
                      <div>
                        <h1
                          style={{
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: "white",
                          }}
                        >
                          {movie.title}
                        </h1>
                        <p style={{ color: "white" }}>
                          {formatTanggal(movie.release_date)}
                        </p>
                      </div>

                      <div>
                        {/* TOMBOL FAVORITE */}
                        <div>
                          <button
                            className="fav-btn ml-3 text-2xl cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(movie.id, movie);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={
                                isFavorite(movie.id) ? fasBookmark : farBookmark
                              }
                              className="text-white"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
