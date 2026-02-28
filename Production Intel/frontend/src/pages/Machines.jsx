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
