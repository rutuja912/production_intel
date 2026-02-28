import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Machines() {
  const [machines, setMachines] = useState([]);
  const [newMachine, setNewMachine] = useState({
    name: "",
    max_hours: "",
  });

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    const res = await fetch(`${API}/machines`);
    const data = await res.json();
    setMachines(data);
  };

  const addMachine = async () => {
    if (!newMachine.name) return;

    await fetch(`${API}/machines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newMachine.name,
        max_hours: Number(newMachine.max_hours) || 8,
        actual_hours: 0,
        downtime: 0,
      }),
    });

    setNewMachine({ name: "", max_hours: "" });
    fetchMachines();
  };

  return (
    <div>
      <h1 style={styles.title}>Machines</h1>

      <div style={styles.card}>
        <h3>Add Machine</h3>
        <div style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="Machine Name"
            value={newMachine.name}
            onChange={(e) =>
              setNewMachine({ ...newMachine, name: e.target.value })
            }
          />
          <input
            style={styles.input}
            type="number"
            placeholder="Max Hours"
            value={newMachine.max_hours}
            onChange={(e) =>
              setNewMachine({ ...newMachine, max_hours: e.target.value })
            }
          />
          <button style={styles.button} onClick={addMachine}>
            Add
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h3>Machine Capacity Overview</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Max Hours</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((m) => (
              <tr key={m.id}>
                <td style={styles.td}>{m.name}</td>
                <td style={styles.td}>{m.max_hours}</td>
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
};
