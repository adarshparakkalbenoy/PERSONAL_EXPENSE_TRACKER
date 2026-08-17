import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MonthComparisonChart({ data }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data || !data.current_month || !data.last_month) {
      setChartData(null);
      return;
    }

    const prepared = {
      labels: [data.last_month.name, data.current_month.name],
      datasets: [
        {
          label: "Total Spending ($)",
          data: [data.last_month.total, data.current_month.total],
          backgroundColor: ["#a3782c", "#2f6b63"],
          borderColor: ["#a3782c", "#2f6b63"],
          borderWidth: 1,
        },
      ],
    };

    setChartData(prepared);
  }, [data]);

  if (!chartData) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "var(--ink-soft)" }}>
        No spending data available.
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          font: { size: 12 },
          color: "var(--ink-base)",
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "var(--ink-soft)",
          callback: (value) => `$${value}`,
        },
      },
      x: {
        ticks: {
          color: "var(--ink-soft)",
        },
      },
    },
  };

  // Calculate change
  const changePercent = data.change_percent;
  const changeColor = changePercent > 0 ? "#d9534f" : "#5cb85c";
  const changeArrow = changePercent > 0 ? "↑" : changePercent < 0 ? "↓" : "→";

  return (
    <div>
      <div style={{ position: "relative", height: "300px", marginBottom: "2rem" }}>
        <Bar data={chartData} options={options} />
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          backgroundColor: "var(--surface)",
          borderRadius: "0.5rem",
          color: changeColor,
          fontSize: "1.1rem",
          fontWeight: 600,
        }}
      >
        {changeArrow} {Math.abs(changePercent)}% compared to {data.last_month.name}
      </div>
    </div>
  );
}
