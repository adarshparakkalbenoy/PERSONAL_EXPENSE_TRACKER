import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const LABELS = {
  food: "Food",
  rent: "Rent",
  utilities: "Utilities",
  entertainment: "Entertainment",
};

const COLORS = {
  food: "#2f6b63",
  rent: "#a3782c",
  utilities: "#5c7a99",
  entertainment: "#b5482f",
};

export default function CategoryPieChart({ totals }) {
  const entries = Object.entries(totals || {});
  const hasData = entries.some(([, value]) => value > 0);

  if (!hasData) {
    return (
      <div className="card empty-state">
        <p style={{ margin: 0 }}>Add some expenses this month to see the breakdown.</p>
      </div>
    );
  }

  const data = {
    labels: entries.map(([key]) => LABELS[key] || key),
    datasets: [
      {
        data: entries.map(([, value]) => value),
        backgroundColor: entries.map(([key]) => COLORS[key] || "#999"),
        borderColor: "#faf9f6",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { family: "Inter", size: 13 }, color: "#1c2430" },
      },
    },
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
      <Pie data={data} options={options} />
    </div>
  );
}
