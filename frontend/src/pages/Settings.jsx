import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Settings() {
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/profile/")
      .then(({ data }) => setBudget(data.monthly_budget))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");
    try {
      await api.put("/profile/", { monthly_budget: budget });
      setStatus("Saved.");
    } catch {
      setStatus("Could not save. Enter a valid number.");
    }
  }

  return (
    <div className="page">
      <div className="section-header">
        <h1>Settings</h1>
      </div>
      <div className="card" style={{ maxWidth: 420 }}>
        <span className="eyebrow">Monthly budget</span>
        <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: "0.3rem" }}>
          We'll highlight your dashboard when this month's spending goes over this amount.
        </p>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="budget">Threshold ($)</label>
              <input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit">
              Save
            </button>
            {status && <p style={{ fontSize: 13, marginTop: "0.6rem", color: "var(--ink-soft)" }}>{status}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
