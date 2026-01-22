import { Navigate, Outlet } from "react-router-dom";
import { auth } from "./firebase";

export default function ProtectedRoute() {
  const user = auth.currentUser;

  // Belum login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Sudah login
  return <Outlet />;
}
