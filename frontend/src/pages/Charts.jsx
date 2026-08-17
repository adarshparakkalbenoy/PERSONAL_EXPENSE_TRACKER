import { useEffect, useState } from "react";
import api from "../api/axios";
import CategoryPieChart from "../components/CategoryPieChart";
import DailyTrendsChart from "../components/DailyTrendsChart";
import MonthComparisonChart from "../components/MonthComparisonChart";

export default function Charts() {
  const [totals, setTotals] = useState(null);
  const [dailyTrends, setDailyTrends] = useState(null);
  const [monthComparison, setMonthComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, dailyRes, comparisonRes] = await Promise.all([
          api.get("/summary/category/"),
          api.get("/summary/daily-trends/"),
          api.get("/summary/month-comparison/"),
        ]);

        setTotals(categoryRes.data);
        setDailyTrends(dailyRes.data);
        setMonthComparison(comparisonRes.data);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="page">
      {/* Category Breakdown */}
      <div className="section-header">
        <h1>Spending by category</h1>
      </div>
      <p style={{ color: "var(--ink-soft)", marginTop: "-0.6rem", marginBottom: "1.5rem" }}>
        Split of this month's spending across food, rent, utilities, and entertainment.
      </p>
      {loading ? <p style={{ color: "var(--ink-soft)" }}>Loading…</p> : <CategoryPieChart totals={totals} />}

      {/* Daily Trends */}
      <div className="section-header" style={{ marginTop: "3rem" }}>
        <h1>Daily spending trends</h1>
      </div>
      <p style={{ color: "var(--ink-soft)", marginTop: "-0.6rem", marginBottom: "1.5rem" }}>
        How your daily spending is distributed throughout this month.
      </p>
      {loading ? (
        <p style={{ color: "var(--ink-soft)" }}>Loading…</p>
      ) : (
        <DailyTrendsChart data={dailyTrends} chartType="line" />
      )}

      {/* Month Comparison */}
      <div className="section-header" style={{ marginTop: "3rem" }}>
        <h1>Month-over-month comparison</h1>
      </div>
      <p style={{ color: "var(--ink-soft)", marginTop: "-0.6rem", marginBottom: "1.5rem" }}>
        Compare your current month's spending with the previous month.
      </p>
      {loading ? (
        <p style={{ color: "var(--ink-soft)" }}>Loading…</p>
      ) : (
        <MonthComparisonChart data={monthComparison} />
      )}
    </div>
  );
}
