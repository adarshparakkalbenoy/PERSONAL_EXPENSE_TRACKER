const CATEGORY_LABELS = {
  food: "Food",
  rent: "Rent",
  utilities: "Utilities",
  entertainment: "Entertainment",
};

export default function ExpenseList({ expenses, onToggle, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="card empty-state">
        <p style={{ margin: 0 }}>No expenses yet. Add your first one above.</p>
      </div>
    );
  }

  return (
    <div className="card">
      {expenses.map((exp) => (
        <div className="ledger-row" key={exp.id}>
          <div>
            <div
              className="ledger-title"
              style={{ textDecoration: exp.completed ? "line-through" : "none", opacity: exp.completed ? 0.55 : 1 }}
            >
              {exp.title}
            </div>
            <div className="ledger-meta">{exp.date}</div>
          </div>
          <span className="category-pill">{CATEGORY_LABELS[exp.category] || exp.category}</span>
          <span className="amount">${Number(exp.amount).toFixed(2)}</span>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              className="icon-btn"
              onClick={() => onToggle(exp)}
              title={exp.completed ? "Mark unpaid" : "Mark paid"}
            >
              {exp.completed ? "Undo" : "Paid"}
            </button>
            <button className="icon-btn" onClick={() => onDelete(exp.id)} title="Delete">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
