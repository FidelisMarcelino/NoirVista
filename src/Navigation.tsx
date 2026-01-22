import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Navigation() {
  const loc = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        setUser({
          ...currentUser,
          displayName: snap.data()?.username,
        } as User);
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between p-3 rounded-b text-white fixed z-50 w-full bg-[#0F0E0E]">
        {/* LEFT */}
        <div className="hidden md:flex gap-2 items-center">
          <Link to="/home">
            <img src="Logo.png" alt="Logo" className="h-8" />
          </Link>

          <Link to="/home">
            <button
              className={`${
                loc.pathname.startsWith("/home") ? "underline" : ""
              }`}
            >
              Home
            </button>
          </Link>

          <Link to="/favorites">
            <button
              className={`${
                loc.pathname.startsWith("/favorites") ? "underline" : ""
              }`}
            >
              Favorites
            </button>
          </Link>

          <Link to="/filter">
            <button
              className={`${
                loc.pathname.startsWith("/filter") ? "underline" : ""
              }`}
            >
              Filter
            </button>
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {!user ? (
            <>
              <Link to="/register">
                <button className="border border-white px-4 py-2 rounded-md hover:bg-red-600">
                  Register
                </button>
              </Link>

              <Link to="/login">
                <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md">
                  Login
                </button>
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm opacity-90">
                Welcome,{" "}
                <span className="font-semibold">{user.displayName}</span>
              </span>

              <Link to="/profile">
                <div className="w-12 h-12 bg-red-500 rounded-full relative flex items-center justify-center border-2 border-black">
                  <svg width="30" height="30" fill="white" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                  </svg>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        {isOpen && (
          <div className="fixed top-16 left-0 w-full bg-[#0F0E0E] text-white flex flex-col gap-4 p-4 md:hidden z-40">
            <Link to="/home" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/favorites" onClick={() => setIsOpen(false)}>
              Favorites
            </Link>
            <Link to="/filter" onClick={() => setIsOpen(false)}>
              Filter
            </Link>

            {!user ? (
              <>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  Profile
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="pt-20 px-2 min-h-screen">
        <Outlet />
      </div>

      <footer className="text-center text-gray-400 py-4 bg-[#0F0E0E]">
        <p className="text-sm">© 2025 NorVista. All Rights Reserved.</p>
      </footer>
    </>
  );
}
