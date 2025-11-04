import { useState } from "react";
import { login, signup } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();

  const handleLogin = async () => {
    const res = await login(email, password);
    if (res.token) {
      setToken(res.token);
      onClose();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="modal">
      <h2>Login</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}