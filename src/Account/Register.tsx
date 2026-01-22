import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setMessage("Password does not match");
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        createdAt: new Date(),
      });

      await signOut(auth);

      setMessage("Sign Up Success!");
      navigate("/login", { replace: true });
    } catch (err: any) {
      setMessage(err.message);
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
        <h1 className="text-2xl font-bold text-center">Register</h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 rounded bg-gray-800"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

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

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 rounded bg-gray-800"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-700 py-2 rounded font-semibold cursor-pointer"
        >
          {loading ? "Loading..." : "Register"}
        </button>

        {/* Already have account */}
        <p className="text-sm text-white text-center opacity-85">
          Already have an account?{" "}
          <a href="/login" className="text-red-600 hover:underline hover:text-red-500">
            Sign in
          </a>
        </p>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-sm ${
              message.includes("Success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
