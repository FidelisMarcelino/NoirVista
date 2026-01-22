import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      setEmail(user.email || "");

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setUsername(snap.data().username);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [navigate]);

  const handleUpdate = async () => {
    if (!auth.currentUser) return;

    try {
      setMessage("Updating...");

      // Update Firestore
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        username,
      });

      // Update Auth profile
      await updateProfile(auth.currentUser, {
        displayName: username,
      });

      await auth.currentUser.reload();

      setMessage("Profile updated successfully ✅");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-2">
      <div className="w-full max-w-md bg-[#111] p-6 rounded-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">Profile</h1>

        <div>
          <label className="text-sm opacity-80">Email</label>
          <input
            value={email}
            disabled
            className="w-full p-2 mt-1 rounded bg-gray-800 opacity-70"
          />
        </div>

        <div>
          <label className="text-sm opacity-80">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-gray-800"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded font-semibold"
        >
          Update Profile
        </button>

        {message && (
          <p className="text-sm text-center mt-2 opacity-90">{message}</p>
        )}
      </div>

      <div>
        <button
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
          className="text-center mt-6 bg-red-700 hover:bg-red-800 px-4 py-2 rounded-md font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
