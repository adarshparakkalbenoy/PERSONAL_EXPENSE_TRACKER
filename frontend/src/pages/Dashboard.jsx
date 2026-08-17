import { useEffect, useState } from "react";
import api from "../api/axios";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import BudgetAlert from "../components/BudgetAlert";
import DailyThought from "../components/DailyThought";
import SmartSuggestions from "../components/SmartSuggestions";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const [expensesRes, budgetRes] = await Promise.all([
      api.get("/expenses/"),
      api.get("/summary/budget/"),
    ]);
    setExpenses(expensesRes.data);
    setBudget(budgetRes.data);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function handleAdd(payload) {
    await api.post("/expenses/", payload);
    await refresh();
  }

  async function handleToggle(expense) {
    await api.patch(`/expenses/${expense.id}/`, { completed: !expense.completed });
    await refresh();
  }

  async function handleDelete(id) {
    await api.delete(`/expenses/${id}/`);
    await refresh();
  }

  return (
    <div className="page">
      <DailyThought compact={true} />

      <div className="section-header" style={{ marginTop: "1rem" }}>
        <h1>Your Expenses & Budget</h1>
      </div>

      {!loading && <BudgetAlert budget={budget} />}

      <ExpenseForm onAdd={handleAdd} />

      {!loading && <SmartSuggestions expenses={expenses} budget={budget} />}

      {loading ? (
        <p style={{ color: "var(--ink-soft)", marginTop: "1.5rem" }}>Loading…</p>
      ) : (
        <div style={{ marginTop: "1.5rem" }}>
          <ExpenseList expenses={expenses} onToggle={handleToggle} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}
