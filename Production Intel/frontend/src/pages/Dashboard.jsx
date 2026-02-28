import { useEffect, useState } from "react";

// const API = "http://127.0.0.1:8000";
const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res = await fetch(`${API}/dashboard`);
    const result = await res.json();
    setData(result);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={styles.title}>Operational Dashboard</h1>

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        <KPI
          title="Overall Utilization"
          value={`${data.overall_utilization}%`}
        />
        <KPI
          title="Unused Capacity (hrs)"
          value={data.capacity_gap}
        />
        <KPI
          title="Overloaded Machines"
          value={data.overloaded_machines.length}
          danger
        />
        <KPI
          title="Idle Machines"
          value={data.idle_machines.length}
        />
      </div>

      {/* Machine Summary Table */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Machine Workload Summary</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Machine</th>
              <th style={styles.th}>Capacity</th>
              <th style={styles.th}>Today Logged</th>
              <th style={styles.th}>Utilization</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.machine_summary.map((m) => {
              const statusColor =
                m.status === "Overloaded"
                  ? "#dc2626"
                  : m.status === "Idle"
                  ? "#f59e0b"
                  : "#16a34a";

              return (
                <tr key={m.machine_id}>
                  <td style={styles.td}>{m.machine_name}</td>
                  <td style={styles.td}>{m.capacity}</td>
                  <td style={styles.td}>{m.today_logged}</td>
                  <td style={styles.td}>{m.utilization_percent}%</td>
                  <td
                    style={{
                      ...styles.td,
                      fontWeight: 600,
                      color: statusColor,
                    }}
                  >
                    {m.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KPI({ title, value, danger }) {
  return (
    <div
      style={{
        ...styles.kpiCard,
        backgroundColor: danger ? "#fee2e2" : "white",
      }}
    >
      <div style={styles.kpiTitle}>{title}</div>
      <div style={styles.kpiValue}>{value}</div>
    </div>
  );
}

const styles = {
  title: { marginBottom: "30px" },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },

  kpiCard: {
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },

  kpiTitle: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "8px",
  },

  kpiValue: {
    fontSize: "28px",
    fontWeight: "bold",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },

  cardTitle: { marginBottom: "20px" },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#f3f4f6",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
};