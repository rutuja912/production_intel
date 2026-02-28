import { useEffect, useState } from "react";

// const API = "http://127.0.0.1:8000";
const API = import.meta.env.VITE_API_URL;

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [machines, setMachines] = useState([]);
  const [orders, setOrders] = useState([]);

  const [newLog, setNewLog] = useState({
    machine_id: "",
    work_order_id: "",
    log_date: "",
    actual_hours: "",
    downtime: "",
  });

  useEffect(() => {
    fetchLogs();
    fetchMachines();
    fetchOrders();
  }, []);

  const fetchLogs = async () => {
    const res = await fetch(`${API}/machine-logs`);
    const data = await res.json();
    setLogs(data);
  };

  const fetchMachines = async () => {
    const res = await fetch(`${API}/machines`);
    const data = await res.json();
    setMachines(data);
  };

  const fetchOrders = async () => {
    const res = await fetch(`${API}/work-orders`);
    const data = await res.json();
    setOrders(data);
  };

  const addLog = async () => {
    if (!newLog.machine_id || !newLog.work_order_id) return;

    await fetch(`${API}/machine-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        machine_id: Number(newLog.machine_id),
        work_order_id: Number(newLog.work_order_id),
        log_date: newLog.log_date,
        actual_hours: Number(newLog.actual_hours) || 0,
        downtime: Number(newLog.downtime) || 0,
      }),
    });

    setNewLog({
      machine_id: "",
      work_order_id: "",
      log_date: "",
      actual_hours: "",
      downtime: "",
    });

    fetchLogs();
  };

  return (
    <div>
      <h1 style={styles.title}>Machine Logs</h1>

      {/* Add Log */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Add Daily Log</h3>

        <div style={styles.formRow}>
          <select
            style={styles.input}
            value={newLog.machine_id}
            onChange={(e) =>
              setNewLog({ ...newLog, machine_id: e.target.value })
            }
          >
            <option value="">Select Machine</option>
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            style={styles.input}
            value={newLog.work_order_id}
            onChange={(e) =>
              setNewLog({ ...newLog, work_order_id: e.target.value })
            }
          >
            <option value="">Select Work Order</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.client_name} - {o.product_name}
              </option>
            ))}
          </select>

          <input
            type="date"
            style={styles.input}
            value={newLog.log_date}
            onChange={(e) =>
              setNewLog({ ...newLog, log_date: e.target.value })
            }
          />

          <input
            type="number"
            style={styles.input}
            placeholder="Actual Hours"
            value={newLog.actual_hours}
            onChange={(e) =>
              setNewLog({ ...newLog, actual_hours: e.target.value })
            }
          />

          <input
            type="number"
            style={styles.input}
            placeholder="Downtime"
            value={newLog.downtime}
            onChange={(e) =>
              setNewLog({ ...newLog, downtime: e.target.value })
            }
          />

          <button style={styles.button} onClick={addLog}>
            Add
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Log History</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Machine</th>
              <th style={styles.th}>Work Order</th>
              <th style={styles.th}>Hours</th>
              <th style={styles.th}>Downtime</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td style={styles.td}>{log.log_date}</td>
                <td style={styles.td}>{log.machine_id}</td>
                <td style={styles.td}>{log.work_order_id}</td>
                <td style={styles.td}>{log.actual_hours}</td>
                <td style={styles.td}>{log.downtime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  title: { marginBottom: "25px" },
  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  cardTitle: { marginBottom: "20px" },
  formRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
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