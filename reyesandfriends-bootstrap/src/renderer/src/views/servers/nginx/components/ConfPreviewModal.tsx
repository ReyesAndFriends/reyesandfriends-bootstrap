
import { useEffect, useState } from "react";
import { NginxConfig } from "../types";
import useNginxServerUtils from "../useNginxServerUtils";

declare global {
  interface Window {
    settingsAPI?: {
      getWorkdir: () => Promise<string>;
      setWorkdir: (path: string) => Promise<void>;
      selectWorkdir: () => Promise<string | null>;
      getDefaultWorkdir: () => Promise<string>;
      openApacheConfigDir: () => Promise<string>;
      openNginxConfigDir: () => Promise<string>;
    };
  }
}

function ConfPreviewModal({
  open,
  onClose,
  config,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  config?: NginxConfig;
  onSave?: (filename: string, content: string, saveDir: string | null) => Promise<boolean | void>;
}) {
  const { generateNginxConf } = useNginxServerUtils();
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [saveOption, setSaveOption] = useState<"default" | "custom">("default");
  const [customPath, setCustomPath] = useState<string | null>(null);
  const [defaultSaveDir, setDefaultSaveDir] = useState<string>("");

  useEffect(() => {
    if (config) {
      const firstDomain = config.domains?.split(",")[0]?.trim() || "nginx";
      setFilename(`${firstDomain}.conf`); 
      setContent(generateNginxConf(config));
    }
  }, [config, generateNginxConf, open]);

  useEffect(() => {
    window.settingsAPI?.getWorkdir().then((dir) => {
      setDefaultSaveDir(`${dir}/http-configs/nginx`);
    });
    setSaveOption("default");
    setCustomPath(null);
  }, [open]);

  const handleChooseCustomPath = async () => {
    const selected = await window.settingsAPI?.selectWorkdir();
    if (selected) setCustomPath(selected);
  };

  if (!open || !config) return null;

  return (
    <div className="modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 3000 }}>
      <div className="modal" style={{ background: "#fff", maxWidth: 700, margin: "40px auto", padding: 24, position: "relative", maxHeight: "95vh", minHeight: 600, overflowY: "auto", borderRadius: 6, display: "flex", flexDirection: "column" }}>
        <h3 style={{ marginTop: 0 }}>Previsualización .conf</h3>
        <div style={{ marginBottom: 16 }}>
          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <legend style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>¿Dónde guardar?</legend>
            <label style={{ display: "block", marginBottom: 6 }}>
              <input type="radio" checked={saveOption === "default"} onChange={() => setSaveOption("default")} style={{ marginRight: 6 }} />
              Guardar en <span style={{ fontFamily: "monospace" }}>{defaultSaveDir}</span>
            </label>
            <label style={{ display: "block", marginBottom: 6 }}>
              <input type="radio" checked={saveOption === "custom"} onChange={() => setSaveOption("custom")} style={{ marginRight: 6 }} />
              Elegir otro lugar
            </label>
          </fieldset>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Nombre del archivo:
            <input type="text" value={filename} onChange={e => setFilename(e.target.value)} style={{ width: 300, marginLeft: 8 }} />
          </label>
        </div>
        {saveOption === "custom" && (
          <div style={{ marginBottom: 12 }}>
            <button className="button secondary" type="button" onClick={handleChooseCustomPath} style={{ marginRight: 8 }}>
              Elegir carpeta destino...
            </button>
            <span style={{ fontSize: 13, color: "#888" }}>{customPath ? customPath : "No se ha seleccionado carpeta"}</span>
          </div>
        )}
        <pre style={{ background: "#222", color: "#fff", padding: 16, borderRadius: 4, maxHeight: 350, overflow: "auto", fontSize: 14, marginBottom: 16, flex: "1 1 auto" }}>{content}</pre>
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <button className="button secondary" type="button" onClick={onClose} style={{ marginRight: 8 }}>Cancelar</button>
          <button
            className="button primary"
            type="button"
            disabled={(saveOption === "custom" && !customPath) || !filename.trim()}
            onClick={async () => {
              if (onSave) {
                await onSave(
                  filename,
                  content,
                  saveOption === "default" ? defaultSaveDir : customPath || null
                );
              }
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfPreviewModal;
