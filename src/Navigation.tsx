import { Link, Outlet, useLocation } from "react-router-dom";

export default function Navigation() {
  const loc = useLocation();

  return (
    <>
      <div className="flex items-center justify-between p-3 rounded-b text-white fixed z-50 w-full bg-[#0F0E0E]">
        <div className="flex gap-2 items-center">
          <Link to="/home">
            <img src="Logo.png" alt="Logo" className="w-auto h-8" />
          </Link>

          <Link to="/home">
            <button
              className={`${
                loc.pathname.startsWith("/home") ? "underline text-white" : ""
              } cursor-pointer`}
            >
              Home
            </button>
          </Link>

          <Link to="/favorites">
            <button
              className={`${
                loc.pathname.startsWith("/favorites")
                  ? "underline text-white"
                  : ""
              } cursor-pointer`}
            >
              Favorites
            </button>
          </Link>

          <Link to="/filter">
            <button
              className={`${
                loc.pathname.startsWith("/filter")
                  ? "underline text-white"
                  : ""
              } cursor-pointer`}
            >
              Filter
            </button>
          </Link>
        </div>
      </div>

      <div className="p-2">
        <Outlet />
      </div>

      {/* FOOTER */}
      <footer className="text-center text-gray-400 py-4 bg-[#0F0E0E]">
        <p className="text-sm">© 2025 NorVista. All Rights Reserved.</p>
      </footer>
    </>
  );
}
