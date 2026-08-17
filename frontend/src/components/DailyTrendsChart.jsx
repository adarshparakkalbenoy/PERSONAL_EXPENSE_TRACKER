import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function DailyTrendsChart({ data, chartType = "line" }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      setChartData(null);
      return;
    }

    // Sort days numerically and create labels
    const days = Object.keys(data)
      .map((d) => parseInt(d, 10))
      .filter((d) => !isNaN(d))
      .sort((a, b) => a - b);

    const labels = days.map((day) => `Day ${day}`);
    const values = days.map((day) => data[day] || 0);

    const prepared = {
      labels,
      datasets: [
        {
          label: "Daily Spending ($)",
          data: values,
          borderColor: "#2f6b63",
          backgroundColor: chartType === "bar" ? "#2f6b63" : "rgba(47, 107, 99, 0.1)",
          borderWidth: 2,
          fill: chartType === "line",
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };

    setChartData(prepared);
  }, [data, chartType]);

  if (!chartData) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "var(--ink-soft)" }}>
        Add some expenses this month to see daily spending trends.
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

  return (
    <div style={{ position: "relative", height: "300px", marginBottom: "2rem" }}>
      {chartType === "line" ? <Line data={chartData} options={options} /> : <Bar data={chartData} options={options} />}
    </div>
  );
}
