import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { addFavorite, isFavorite, removeFavorites } from "./favoriteUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";

function formatTanggal(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function DetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);

  const fetchDetail = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=a777627566d2e4cc9e4af010e47779da&append_to_response=videos&region=ID`
      );

      setMovie(res.data);

      const trailer = res.data.videos?.results?.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube"
      );

      if (trailer) setTrailerKey(trailer.key);
    } catch (err) {
      console.error("Gagal nge-fetch detail:", err);
    }
  };

  const toggleFavorite = () => {
    if (favorite) {
      removeFavorites(Number(id));
    } else {
      if (movie) {
        addFavorite(movie);
      }
    }
    setFavorite(!favorite);
  };

  useEffect(() => {
    fetchDetail();

    setFavorite(isFavorite(Number(id)));
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <>
      <div style={{ padding: "20px", color: "white", marginTop: "30px"}}>
        <Link to="/home">
          <button className="bg-red-700 p-1 rounded font-bold cursor-pointer">
            Back
          </button>
        </Link>

        <button
          onClick={toggleFavorite}
          className="fav-btn ml-3 text-2xl cursor-pointer"
        >
          <FontAwesomeIcon icon={favorite ? fasBookmark : farBookmark} />
        </button>

        <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>{movie.title}</h1>

        <div className="flex gap-2">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            alt={movie.title}
            className="h-60 rounded-md"
          />
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="h-60 rounded-md"
          />
        </div>

        <p style={{ marginTop: "10px", opacity: 0.8 }}>
          {movie.overview || "Tidak ada sinopsis."}
        </p>

        <p>
          <b>Release:</b> {formatTanggal(movie.release_date)}
        </p>
        <p>
          <b>Rating:</b> ⭐ {movie.vote_average?.toFixed(1)}
        </p>

        {/* Genre */}
        <p>
          <b>Genres: </b> {" "}
          {movie.genres ?.map((g: any) => g.name).join(", ") || "Tidak ada genre"}
        </p>

        <div style={{ marginTop: "20px" }}>
          {trailerKey ? (
            <iframe
              width="100%"
              height="450"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <p>Tidak ada trailer.</p>
          )}
        </div>
      </div>
    </>
  );
}
