import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const successMessage = location.state?.successMessage;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmedUsername = form.username.trim();
    if (!trimmedUsername || !form.password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      await login({ username: trimmedUsername, password: form.password });
      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password. Please check your credentials.");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Could not connect to backend server. Make sure the backend Django server is running on http://127.0.0.1:8000.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <span className="eyebrow">Welcome Back</span>
        <h1 style={{ marginTop: "0.3rem", marginBottom: "1.2rem" }}>Log in to Account</h1>

        {successMessage && !error && (
          <div className="alert-box alert-success" style={{ marginBottom: "1rem", backgroundColor: "rgba(16, 185, 129, 0.1)", borderColor: "#10b981", color: "#065f46" }}>
            <span>✅</span>
            <div>{successMessage}</div>
          </div>
        )}

        {error && (
          <div className="alert-box alert-danger">
            <span>⚠️</span>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoFocus
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", marginTop: "0.6rem" }}
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: "1.4rem", textAlign: "center" }}>
          No account yet? <Link to="/register" style={{ fontWeight: 600 }}>Register now</Link>
        </p>
      </div>
    </div>
  );
}

