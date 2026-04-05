import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await api.register(email, password, name);
      localStorage.setItem("token", response.token);
      localStorage.setItem("userEmail", response.email);
      localStorage.setItem("userName", response.name);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <div className="error-message">{error}</div>}

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
