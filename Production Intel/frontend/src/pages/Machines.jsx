import { useEffect, useState } from "react";

// const API = "http://127.0.0.1:8000";
const API = import.meta.env.VITE_API_URL;

export default function WorkOrders() {
  const [orders, setOrders] = useState([]);
  const [machines, setMachines] = useState([]);

  const [newOrder, setNewOrder] = useState({
    client_name: "",
    product_name: "",
    estimated_hours: "",
    planned_end_date: "",
    machine_id: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchMachines();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch(`${API}/work-orders`);
    const data = await res.json();
    setOrders(data);
  };

  const fetchMachines = async () => {
    const res = await fetch(`${API}/machines`);
    const data = await res.json();
    setMachines(data);
  };

  const addOrder = async () => {
    if (!newOrder.client_name || !newOrder.machine_id) return;

    await fetch(`${API}/work-orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_name: newOrder.client_name,
        product_name: newOrder.product_name,
        estimated_hours: Number(newOrder.estimated_hours) || 0,
        planned_end_date: newOrder.planned_end_date,
        machine_id: Number(newOrder.machine_id),
      }),
    });

    setNewOrder({
      client_name: "",
      product_name: "",
      estimated_hours: "",
      planned_end_date: "",
      machine_id: "",
    });

    fetchOrders();
  };

  return (
    <div>
      <h1 style={styles.title}>Work Orders</h1>

      {/* Create Order Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Create Work Order</h3>
        <div style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="Client"
            value={newOrder.client_name}
            onChange={(e) =>
              setNewOrder({ ...newOrder, client_name: e.target.value })
            }
          />
          <input
            style={styles.input}
            placeholder="Product"
            value={newOrder.product_name}
            onChange={(e) =>
              setNewOrder({ ...newOrder, product_name: e.target.value })
            }
          />
          <input
            style={styles.input}
            type="number"
            placeholder="Estimated Hours"
            value={newOrder.estimated_hours}
            onChange={(e) =>
              setNewOrder({ ...newOrder, estimated_hours: e.target.value })
            }
          />
          <input
            style={styles.input}
            type="date"
            value={newOrder.planned_end_date}
            onChange={(e) =>
              setNewOrder({ ...newOrder, planned_end_date: e.target.value })
            }
          />
          <select
            style={styles.input}
            value={newOrder.machine_id}
            onChange={(e) =>
              setNewOrder({ ...newOrder, machine_id: e.target.value })
            }
          >
            <option value="">Select Machine</option>
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <button style={styles.button} onClick={addOrder}>
            Add
          </button>
        </div>
      </div>

      {/* Intelligence Table */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Production Risk Intelligence</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Client</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Machine</th>
              <th style={styles.th}>Remaining Hrs</th>
              <th style={styles.th}>Remaining Days</th>
              <th style={styles.th}>Required / Day</th>
              <th style={styles.th}>Capacity</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const isRisk = o.risk;

              return (
                <tr
                  key={o.id}
                  style={{
                    ...styles.tr,
                    backgroundColor: isRisk ? "#fee2e2" : "white",
                  }}
                >
                  <td style={styles.td}>{o.client_name}</td>
                  <td style={styles.td}>{o.product_name}</td>
                  <td style={styles.td}>{o.machine_name}</td>
                  <td style={styles.td}>{o.remaining_hours}</td>
                  <td style={styles.td}>{o.remaining_days}</td>
                  <td style={styles.td}>{o.required_daily_hours}</td>
                  <td style={styles.td}>{o.machine_capacity}</td>
                  <td
                    style={{
                      ...styles.td,
                      fontWeight: 600,
                      color: isRisk ? "#dc2626" : "#16a34a",
                    }}
                  >
                    {isRisk ? "High Risk" : "On Track"}
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
    fontSize: "14px",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
  tr: {
    transition: "background 0.2s",
  },
};
