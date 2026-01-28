import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });

  useEffect(() => {
    if (!window.settingsAPI) return;
    window.settingsAPI.getWorkdir().then((dir) => {
      setWorkdir(dir);
    });
    window.settingsAPI.getDefaultWorkdir().then((dir) => {
      setDefaultWorkdir(dir);
    });
  }, []);

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 3000);
  };

  const handleSelectFolder = async () => {
    setSelecting(true);
    setError(null);
    try {
      const selected = await window.settingsAPI?.selectWorkdir();
      if (selected) {
        await window.settingsAPI?.setWorkdir(selected);
        setWorkdir(selected);
        showToast("Directorio de trabajo actualizado.");
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
      showToast("Directorio restaurado al original.");
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
    <>

      <div className="callout" style={{ padding: 16 }}>
        <div className="row column" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/icons/preferences-desktop-icons.svg"
            alt="Inicio"
            style={{ width: 40, height: 40, marginRight: 16, background: 'transparent' }}
          />
          <div>
            <h2 style={{ fontSize: 20, margin: 0 }}>Preferencias</h2>
            <p className="lead" style={{ fontSize: 14, margin: 0 }}>
              Configura las preferencias de la aplicación.
            </p>
          </div>
        </div>
      </div>

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
        <AnimatePresence>
          {toast.visible && (
            <motion.div
              className="callout success"
              style={{
                position: "fixed",
                bottom: 24,
                right: 24,
                margin: 0,
                borderRadius: 0,
                minWidth: 220,
                maxWidth: 400,
                zIndex: 1000,
                fontSize: 16,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Preferences;
