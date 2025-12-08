export function getFavorites() {
  try {
    const data = localStorage.getItem("favorites");
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    // filter out falsy or malformed entries
    return parsed.filter((item: any) => item && typeof item.id !== "undefined");
  } catch (err) {
    console.error("Error reading favorites from localStorage:", err);
    return [];
  }
}

export function addFavorite(movie: any) {
  if (!movie || typeof movie.id === "undefined") return;

  const fav = getFavorites();
  if (!fav.some((f: any) => f.id === movie.id)) {
    // store a small sanitized object to avoid storing unnecessary properties
    const toStore = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path ?? movie.backdrop_path ?? null,
      backdrop_path: movie.backdrop_path ?? movie.poster_path ?? null,
      release_date: movie.release_date ?? null,
      vote_average: movie.vote_average ?? null,
    };
    fav.push(toStore);
    try {
      localStorage.setItem("favorites", JSON.stringify(fav));
    } catch (err) {
      console.error("Error saving favorites to localStorage:", err);
    }
  }
}

export function removeFavorites(id: number) {
  try {
    const fav = getFavorites();
    const updated = fav.filter((f: any) => f.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updated));
  } catch (err) {
    console.error("Error removing favorite:", err);
  }
}

export function isFavorite(id: number) {
  if (typeof id === "undefined" || id === null) return false;
  return getFavorites().some((f: any) => f && f.id === id);
}
