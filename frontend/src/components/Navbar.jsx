import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";

export default function Navbar() {
  const { isAuthenticated, username, logout } = useAuth();
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    api
      .get("/summary/budget/")
      .then(({ data }) => !cancelled && setBudget(data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          Ledger
        </NavLink>

        {isAuthenticated ? (
          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Dashboard
            </NavLink>
            <NavLink to="/charts" className={({ isActive }) => (isActive ? "active" : "")}>
              Charts
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
              Settings
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
              About
            </NavLink>
            {budget && (
              <span className={`nav-badge ${budget.over_limit ? "over" : ""}`}>
                {budget.percent_used}% of budget
              </span>
            )}
            <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{username}</span>
            <button className="btn btn-ghost" onClick={logout}>
              Log out
            </button>
          </nav>
        ) : (
          <nav className="nav-links">
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
              About
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
              Log in
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
              Register
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}
