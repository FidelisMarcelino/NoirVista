import { useEffect, useState } from "react";
import { getFavorites } from "./favoriteUtils";
import { Link } from "react-router-dom";

export default function Favorite(){
    const [movies, setMovies] = useState<any[]>([]);

    useEffect(() => {
        const favs = getFavorites() || [];
        // filter out falsy / malformed entries
        setMovies(favs.filter((m: any) => m && typeof m.id !== "undefined"));
    }, [])

    return(
        <div className="text-white">
            <h1 className="text-center font-semibold text-2xl mb-2">Favorite Movies</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {movies.length === 0 && <p>Belum ada film tersimpan.</p>}

                {movies.map((m:any) => (
                    <div key={m.id}>
                        <Link to={`/detail/${m.id}`}>
                            {m.poster_path ? (
                                <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} />
                            ) : (
                                <div style={{width: '100%', height: 240, background: '#222'}} />
                            )}
                            <p>{m.title ?? "Untitled"}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}