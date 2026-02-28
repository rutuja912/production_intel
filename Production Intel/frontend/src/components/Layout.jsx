import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Layout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/machines", label: "Machines", icon: "🏭" },
    { path: "/orders", label: "Work Orders", icon: "📦" },
    { path: "/logs", label: "Logs", icon: "📝" },
  ];

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          width: collapsed ? "100px" : "280px",
        }}
      >
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>⚙</div>
          {!collapsed && <div style={styles.brand}>Production Intel</div>}
        </div>

        <nav style={styles.nav}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.navItem,
                  ...(active ? styles.activeNavItem : {}),
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <span style={styles.icon}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={styles.collapseBtn}
        >
          {collapsed ? "➡" : "⬅"}
        </button>
      </aside>

      {/* Main Area */}
      <div style={styles.mainContainer}>
        {/* Top Navbar */}
        <header style={styles.topbar}>
          <div style={styles.searchBox}>🔍 Search...</div>
          <div style={styles.profile}>
            <div style={styles.avatar}>R</div>
            <span style={{ fontSize: "16px", fontWeight: 500 }}>Admin</span>
          </div>
        </header>

        <main style={styles.content}>{children}</main>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f8fafc",
  },
  sidebar: {
    background: "#0f172a",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "30px 18px",
    transition: "width 0.3s ease",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "50px",
    paddingLeft: "8px",
  },
  logo: {
    fontSize: "28px",
  },
  brand: {
    fontSize: "20px",
    fontWeight: "600",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "14px 18px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "#cbd5e1",
    fontSize: "16px",
    fontWeight: 500,
    transition: "all 0.2s",
  },
  activeNavItem: {
    backgroundColor: "#2563eb",
    color: "white",
  },
  icon: {
    fontSize: "20px",
  },
  collapseBtn: {
    background: "#1e293b",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "16px",
  },
  mainContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    height: "70px",
    background: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    borderBottom: "1px solid #e2e8f0",
  },
  searchBox: {
    background: "#f1f5f9",
    padding: "12px 20px",
    borderRadius: "10px",
    color: "#64748b",
    fontSize: "15px",
    minWidth: "240px",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  avatar: {
    width: "38px",
    height: "38px",
    background: "#2563eb",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
  },
  content: {
    padding: "40px",
    overflowY: "auto",
  },
};