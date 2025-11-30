// src/components/LoginModal.jsx
import { useState } from "react";
import { login, signup } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import ModalPortal from "./ModalPortal";

export default function LoginModal({ onClose }) {
  const { setToken } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      const res =
        mode === "login"
          ? await login(email, password)
          : await signup(username, email, password);

      if (res.token) {
        setToken(res.token);
        onClose();
      } else {
        setError(res.message || "Authentication failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] pointer-events-none">
        <div className="bg-white text-black p-6 rounded shadow-md w-96 pointer-events-auto relative">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {mode === "login" ? "Login to Cube Master" : "Create an Account"}
          </h2>

          {mode === "signup" && (
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full mb-3 p-2 border rounded"
            />
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full mb-3 p-2 border rounded"
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            onClick={handleSubmit}
            className="w-full bg-[#29A7D1] text-white py-2 rounded mb-3"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>

          <p className="text-sm text-center">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-blue-600 underline"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>

          <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 block mx-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}
