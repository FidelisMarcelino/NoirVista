import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-2">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#111] p-6 rounded-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* Sign Up */}
          <p className=" text-white text-sm text-center opacity-85">
            Don't have an account?{" "}
            <a href="/signup" className="text-red-600 hover:underline">
              Regis
            </a>
          </p>

          {/* Message */}
          {message && (
            <p className={`mt-4 text-sm ${message.includes("Success") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
      </form>
    </div>
  );
}
