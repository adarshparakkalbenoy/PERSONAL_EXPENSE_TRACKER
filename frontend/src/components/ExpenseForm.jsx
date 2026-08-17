import { useState } from "react";

const CATEGORIES = [
  { value: "food", label: "Food" },
  { value: "rent", label: "Rent" },
  { value: "utilities", label: "Utilities" },
  { value: "entertainment", label: "Entertainment" },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Give the expense a title.");
    if (!amount || Number(amount) <= 0) return setError("Enter an amount greater than 0.");

    setSaving(true);
    try {
      await onAdd({ title: title.trim(), amount, category, date });
      setTitle("");
      setAmount("");
      setCategory("food");
      setDate(todayISO());
    } catch (err) {
      setError(err.response?.data?.detail || "Could not add expense. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "0.8rem", alignItems: "end" }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="title">Title</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Groceries" />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="date">Date</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Adding…" : "Add"}
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
}
