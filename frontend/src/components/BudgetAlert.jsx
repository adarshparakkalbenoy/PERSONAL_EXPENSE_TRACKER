export default function BudgetAlert({ budget }) {
  if (!budget) return null;
  const { spent, budget: limit, over_limit: overLimit, percent_used: percent } = budget;
  const barWidth = Math.min(percent, 100);

  return (
    <div className={`budget-alert ${overLimit ? "over" : ""}`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="eyebrow">This month</span>
        <span className="amount" style={{ fontSize: 14 }}>
          ${spent.toFixed(2)} / ${limit.toFixed(2)}
        </span>
      </div>
      <div className="budget-bar-track">
        <div
          className={`budget-bar-fill ${overLimit ? "over" : ""}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      {overLimit && (
        <p style={{ margin: "0.6rem 0 0", color: "var(--clay)", fontSize: 13 }}>
          You've gone over your monthly budget by ${(spent - limit).toFixed(2)}.
        </p>
      )}
    </div>
  );
}
