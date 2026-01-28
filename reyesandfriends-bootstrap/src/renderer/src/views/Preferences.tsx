import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    settingsAPI?: {
      getWorkdir: () => Promise<string>;
      setWorkdir: (path: string) => Promise<void>;
      selectWorkdir: () => Promise<string | null>;
      getDefaultWorkdir: () => Promise<string>;
    };
  }
}

const Preferences: React.FC = () => {
  const [workdir, setWorkdir] = useState("");
  const [defaultWorkdir, setDefaultWorkdir] = useState("");
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!window.settingsAPI) return;
    window.settingsAPI.getWorkdir().then((dir) => {
      setWorkdir(dir);
    });
    window.settingsAPI.getDefaultWorkdir().then((dir) => {
      setDefaultWorkdir(dir);
    });
  }, []);

  const handleSelectFolder = async () => {
    setSelecting(true);
    setError(null);
    try {
      const selected = await window.settingsAPI?.selectWorkdir();
      if (selected) {
        await window.settingsAPI?.setWorkdir(selected);
        setWorkdir(selected);
      }
    } catch (e) {
      setError("No se pudo seleccionar la carpeta.");
    }
    setSelecting(false);
  };

  const handleRestore = async () => {
    setError(null);
    try {
      await window.settingsAPI?.setWorkdir(defaultWorkdir);
      setWorkdir(defaultWorkdir);
    } catch (e) {
      setError("No se pudo restaurar el directorio original.");
    }
  };

  if (!window.settingsAPI) {
    return (
      <div className="callout alert" style={{ margin: "2rem auto", maxWidth: 600 }}>
        Esta vista solo funciona en la app Electron.<br />
        Abre la aplicación usando el entorno de escritorio.
      </div>
    );
  }

  return (
    <div className="callout secondary" style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h4>Preferencias</h4>
      <div className="callout primary" style={{ marginBottom: 16 }}>
        <label>
          <b>Directorio de trabajo actual:</b>
        </label>
        <div className="input-group">
          <input
            className="input-group-field"
            type="text"
            value={workdir}
            disabled
            style={{ minWidth: 500, width: "100%", background: "#f3f3f3" }}
          />
          <div className="input-group-button">
            <button
              type="button"
              className="button primary"
              onClick={handleSelectFolder}
              disabled={selecting}
              title="Seleccionar carpeta..."
            >
              <i className="fi-folder" style={{ marginRight: 4 }} /> {selecting ? "Abriendo..." : "Seleccionar carpeta"}
            </button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <button type="button" className="button warning" onClick={handleRestore}>
          Restaurar original
        </button>
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: "#888" }}>
        Por defecto se utilizará <span style={{ fontFamily: "monospace" }}>{defaultWorkdir}</span>
      </div>
      {error && (
        <div className="callout alert" style={{ marginTop: 16 }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Preferences;
