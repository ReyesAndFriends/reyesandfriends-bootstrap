import React from "react";
import { Link, useNavigate } from "react-router-dom";

const sidebarButtons = [
  { label: "Inicio", icon: "/icons/folder.svg", route: "/" },
  { label: "Servidores HTTP", icon: "/icons/network-server.svg", route: "/http-servers" },
  { label: "Bases de datos", icon: "/icons/sqlitebrowser.svg", route: "/databases" },
  { label: "Preferencias", icon: "/icons/preferences-desktop-icons.svg", route: "/preferences" },
  { label: "Acerca de", icon: "/icons/help-about.svg", route: "/about" },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div
      className="off-canvas-wrapper"
      style={{
        minHeight: "100vh",
        color: "#111",
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
            width: 150,
            background: "#111",
            padding: "1.2rem 0.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            minHeight: "100vh",
            color: "#f1f1f1",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >

          
          <div
            style={{
              marginTop: "1.2rem",
              marginBottom: "1.2rem",
              textAlign: "center",
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
            }}
          >
            <h5 style={{ color: "#fff", margin: 0, fontSize: "1rem", lineHeight: "1.1" }}>Reyes&Friends<br />Bootstrap</h5>
          </div>

          {sidebarButtons.map((btn) => (
            <Link
              key={btn.label}
              to={btn.route}
              style={{
                background: "#111",
                color: "#f1f1f1",
                border: "none",
                borderRadius: "2px",
                padding: "0.5rem 0",
                textAlign: "center",
                fontSize: "0.92rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.18rem",
                cursor: "pointer",
                width: "100%",
              }}
              onMouseOver={e => (e.currentTarget.style.background = "#31343b")}
              onMouseOut={e => (e.currentTarget.style.background = "#111")}
            >
              {btn.icon.endsWith(".svg") ? (
                <img src={btn.icon} alt={btn.label} style={{ width: 28, height: 28, objectFit: "contain" }} />
              ) : null}
              <span style={{ fontSize: "0.92rem", display: "block", wordBreak: "break-word" }}>{btn.label}</span>
            </Link>
          ))}

          <button
            onClick={() => navigate(-1)}
            style={{
              background: "#111",
              color: "#f1f1f1",
              border: "none",
              borderRadius: "2px",
              padding: "0.4rem 0",
              textAlign: "center",
              fontSize: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.18rem",
              cursor: "pointer",
              width: "100%",
              marginTop: "auto",
              marginBottom: "1rem",
            }}
            title="Volver"
            onMouseOver={e => (e.currentTarget.style.background = "#31343b")}
            onMouseOut={e => (e.currentTarget.style.background = "#111")}
          >
            <img src="/icons/pan-left.svg" alt="Volver" style={{ width: 22, height: 22, objectFit: "contain" }} />
            <span style={{ fontSize: "0.92rem" }}>Atrás</span>
          </button>
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
};

export default Layout;
