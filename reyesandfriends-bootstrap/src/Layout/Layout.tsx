import React from "react";
import { Link } from "react-router-dom";

const sidebarButtons = [
  { label: "Inicio", icon: "/icons/folder.svg", route: "/" },
  { label: "Servidores HTTP", icon: "/icons/network-server.svg", route: "/http-servers" },
  { label: "Scripts SQL", icon: "/icons/sqlitebrowser.svg", route: "/sql-scripts" },
  { label: "Configuración", icon: "/icons/preferences-desktop-icons.svg", route: "/settings" },
  { label: "Acerca de", icon: "/icons/help-about.svg", route: "/about" },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="off-canvas-wrapper"
    style={{
      minHeight: "100vh",
      color: "#23272f",
      background: "#f8f9fa",
      height: "100vh",
      overflow: "hidden",
    }}
  >
    <div
      className="off-canvas-wrapper-inner"
      data-off-canvas-wrapper
      style={{ display: "flex", height: "100vh", overflow: "hidden" }}
    >
      <aside
        className="sidebar-dark"
        style={{
          width: 240,
          background: "#18191a",
          padding: "2rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          minHeight: "100vh",
          color: "#f1f1f1",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            marginBottom: "2rem",
            textAlign: "center",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
        >
          <h5 style={{ color: "#fff", margin: 0 }}>Reyes&Friends Bootstrap</h5>
        </div>

        {sidebarButtons.map((btn) => (
          <Link
            key={btn.label}
            to={btn.route}
            style={{
              background: "#18191a",
              color: "#f1f1f1",
              border: "none",
              borderRadius: "2px",
              padding: "0.75rem 0",
              textAlign: "center",
              fontSize: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer",
              width: "100%",
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#31343b")}
            onMouseOut={e => (e.currentTarget.style.background = "#18191a")}
          >
            {btn.icon.endsWith(".svg") ? (
              <img src={btn.icon} alt={btn.label} style={{ width: "auto", height: 36 }} />
            ) : null}
            <span style={{ fontSize: "1rem", display: "block" }}>{btn.label}</span>
          </Link>
        ))}
      </aside>
      <main
        className="off-canvas-content"
        data-off-canvas-content
        style={{
          flex: 1,
          background: "#f8f9fa",
          color: "#23272f",
          padding: "2rem",
          minHeight: "100vh",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  </div>
);

export default Layout;
