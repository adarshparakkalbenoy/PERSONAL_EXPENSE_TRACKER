import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmedUsername = form.username.trim();
    if (!trimmedUsername) {
      setError("Please enter a username.");
      return;
    }

    if (!form.password) {
      setError("Please enter a password.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register({
        username: trimmedUsername,
        email: form.email.trim(),
        password: form.password,
        password_confirm: form.confirmPassword,
      });
      navigate("/login", {
        state: { successMessage: "Account created successfully! Please log in with your credentials." }
      });
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === "object" && data !== null) {
          if (typeof data.detail === "string") {
            setError(data.detail);
          } else if (typeof data.non_field_errors === "object" && Array.isArray(data.non_field_errors)) {
            setError(data.non_field_errors.join(" "));
          } else {
            const messages = Object.entries(data).map(([key, val]) => {
              const field = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
              const msg = Array.isArray(val) ? val.join(" ") : String(val);
              return `${field}: ${msg}`;
            });
            setError(messages.join(" | "));
          }
        } else if (typeof data === "string") {
          setError(data);
        } else {
          setError("Registration failed. Please check your information.");
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Could not connect to backend server. Make sure the Django server is running.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <span className="eyebrow">Get Started</span>
        <h1 style={{ marginTop: "0.3rem", marginBottom: "1.2rem" }}>Create an Account</h1>

        {error && (
          <div className="alert-box alert-danger">
            <span>⚠️</span>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username *</label>
            <input
              id="username"
              type="text"
              placeholder="e.g. johndoe"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoFocus
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email address (optional)</label>
            <input
              id="email"
              type="email"
              placeholder="e.g. john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password *</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
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

          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", marginTop: "0.6rem" }}
          >
            {loading ? "Creating Account…" : "Register"}
          </button>
        </form>

        <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: "1.4rem", textAlign: "center" }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

