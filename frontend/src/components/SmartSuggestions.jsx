import React from "react";

export default function SmartSuggestions({ expenses = [], budget = null }) {
  if (!budget) return null;

  const { spent = 0, budget: monthlyBudget = 0, over_limit = false, percent_used = 0 } = budget;
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  // Calculate top spending category
  const categoryTotals = safeExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories.length > 0 ? sortedCategories[0] : null;

  // Days remaining in current month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, daysInMonth - now.getDate() + 1);

  const remainingBudget = Math.max(0, monthlyBudget - spent);
  const recommendedDailyCap = (remainingBudget / daysRemaining).toFixed(2);

  // Generate dynamic suggestions list
  const suggestions = [];

  // Budget status suggestion
  if (monthlyBudget === 0) {
    suggestions.push({
      type: "info",
      title: "Set Your Monthly Budget Target",
      icon: "🎯",
      text: "Setting a monthly budget target in Settings helps unlock custom daily caps and automated spending alerts."
    });
  } else if (over_limit) {
    suggestions.push({
      type: "danger",
      title: "Budget Exceeded — Action Needed",
      icon: "🚨",
      text: `You have spent $${spent.toFixed(2)}, exceeding your $${monthlyBudget} budget by $${(spent - monthlyBudget).toFixed(2)}. Consider freezing non-essential 'Wants' (shopping & entertainment) for the rest of this month.`
    });
  } else if (percent_used >= 75) {
    suggestions.push({
      type: "warning",
      title: `75%+ Budget Used (${percent_used}% Spent)`,
      icon: "⚠️",
      text: `You have $${remainingBudget.toFixed(2)} left for the remaining ${daysRemaining} days. Keep daily non-essential spending below $${recommendedDailyCap} to stay within budget.`
    });
  } else {
    suggestions.push({
      type: "success",
      title: `Great Budget Pacing (${percent_used}% Spent)`,
      icon: "🎉",
      text: `You are comfortably pacing at ${percent_used}% of your $${monthlyBudget} budget. You have $${remainingBudget.toFixed(2)} remaining ($${recommendedDailyCap}/day).`
    });
  }

  // Category specific suggestion
  if (topCategory) {
    const [catName, catAmount] = topCategory;
    const catPercent = spent > 0 ? Math.round((catAmount / spent) * 100) : 0;

    let tipText = "";
    if (catName === "food") {
      tipText = `Food & Dining is your top expense ($${catAmount.toFixed(2)} — ${catPercent}% of spend). Cooking at home 2-3 extra days per week can save $100–$200 monthly.`;
    } else if (catName === "entertainment" || catName === "shopping") {
      tipText = `${catName.charAt(0).toUpperCase() + catName.slice(1)} is your top outlay ($${catAmount.toFixed(2)}). Use the 48-hour rule before non-essential purchases to reduce impulse spending.`;
    } else if (catName === "housing" || catName === "utilities") {
      tipText = `${catName.charAt(0).toUpperCase() + catName.slice(1)} accounts for ${catPercent}% of spend ($${catAmount.toFixed(2)}). Ensure utility settings and subscription bills are audited periodically.`;
    } else {
      tipText = `${catName.charAt(0).toUpperCase() + catName.slice(1)} represents ${catPercent}% of total expenses ($${catAmount.toFixed(2)}).`;
    }

    suggestions.push({
      type: "info",
      title: `Top Expense Category: ${catName.charAt(0).toUpperCase() + catName.slice(1)} (${catPercent}%)`,
      icon: "📊",
      text: tipText
    });
  }

  // 50/30/20 Rule Tip
  suggestions.push({
    type: "rule",
    title: "The 50/30/20 Financial Guideline",
    icon: "💡",
    text: "Aim to allocate 50% of income to Needs (housing, groceries, bills), 30% to Wants (dining, hobbies), and 20% directly to Savings & Debt payoff."
  });

  return (
    <div className="smart-suggestions-section">
      <div className="section-header" style={{ marginBottom: "0.8rem" }}>
        <h2>💡 Smart Financial Advisor</h2>
        <span className="subtitle">Personalized suggestions based on your current budget & spending patterns</span>
      </div>

      <div className="suggestions-grid">
        {suggestions.map((item, idx) => (
          <div key={idx} className={`suggestion-card suggestion-${item.type}`}>
            <div className="suggestion-icon">{item.icon}</div>
            <div className="suggestion-content">
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
