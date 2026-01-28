import { useState, useEffect } from "react";
import useApacheServerUtils from "./useApacheServerUtils";
import { AnimatePresence, motion } from "framer-motion";

type ApacheConfig = {
  dominios: string;
  http: boolean;
  https: boolean;
  path: string;
  ssl: "certbot" | "snakeoil" | "custom";
  sslCustomCert?: string;
  sslCustomKey?: string;
  sslCustom?: string;
  redirect: boolean;
  isProxy: boolean;
  proxyTarget: string;
};

function ApacheConfigModal({
  open,
  onClose,
  initialData,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<ApacheConfig>;
  onSave?: (data: ApacheConfig) => void;
}) {
  const [dominios, setDominios] = useState(initialData?.dominios ?? "");
  const [http, setHttp] = useState(initialData?.http ?? true);
  const [https, setHttps] = useState(initialData?.https ?? false);
  const [path, setPath] = useState(initialData?.path ?? "/var/www/html");
  const [ssl, setSsl] = useState<"certbot" | "snakeoil" | "custom">(initialData?.ssl ?? "certbot");
  const [sslCustomCert, setSslCustomCert] = useState(initialData?.sslCustomCert ?? (initialData?.sslCustom?.split("::")[0] ?? ""));
  const [sslCustomKey, setSslCustomKey] = useState(initialData?.sslCustomKey ?? (initialData?.sslCustom?.split("::")[1] ?? ""));
  const [redirect, setRedirect] = useState(initialData?.redirect ?? false);
  const [isProxy, setIsProxy] = useState(initialData?.isProxy ?? false);
  const [proxyTarget, setProxyTarget] = useState(initialData?.proxyTarget ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDominios(initialData?.dominios ?? "");
    setHttp(initialData?.http ?? true);
    setHttps(initialData?.https ?? false);
    setPath(initialData?.path ?? "/var/www/html");
    setSsl(initialData?.ssl ?? "certbot");
    setSslCustomCert(initialData?.sslCustomCert ?? (initialData?.sslCustom?.split("::")[0] ?? ""));
    setSslCustomKey(initialData?.sslCustomKey ?? (initialData?.sslCustom?.split("::")[1] ?? ""));
    setRedirect(initialData?.redirect ?? false);
    setIsProxy(initialData?.isProxy ?? false);
    setProxyTarget(initialData?.proxyTarget ?? "");
    setError(null);
  }, [open, initialData]);

  // Limpiar campos dependientes cuando se deshabilitan
  useEffect(() => {
    // Si se desactiva https, limpiar redirect y certificados custom
    if (!https) {
      setRedirect(false);
      if (ssl !== "certbot") setSsl("certbot");
      setSslCustomCert("");
      setSslCustomKey("");
    }
    // Si se desactiva proxy, limpiar proxyTarget
    if (!isProxy) {
      setProxyTarget("");
    }
    // Si se desactiva custom SSL, limpiar campos custom
    if (ssl !== "custom") {
      setSslCustomCert("");
      setSslCustomKey("");
    }
    // Si se activa proxy, limpiar path
    if (isProxy) {
      setPath("");
    }
    // Si se desactiva proxy, restaurar path si está vacío
    if (!isProxy && !path) {
      setPath("/var/www/html");
    }
  }, [https, ssl, isProxy]);

  // Validaciones
  useEffect(() => {
    // Validar dominios: al menos uno no vacío y con formato dominio.tld
    const dominiosList = dominios
      .split(",")
      .map(d => d.trim())
      .filter(d => d.length > 0);

    if (dominiosList.length === 0) {
      setError("Debes ingresar al menos un dominio.");
      return;
    }
    // Validar formato dominio.tld (básico)
    const dominioRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (dominiosList.some(d => !dominioRegex.test(d))) {
      setError("Todos los dominios deben tener formato válido (ej: midominio.com).");
      return;
    }
    if (!http && !https) {
      setError("Debes habilitar HTTP (80), HTTPS (443) o ambos.");
      return;
    }
    if (!isProxy && !path.trim()) {
      setError("El path del sitio es obligatorio.");
      return;
    }
    if (isProxy && !proxyTarget.trim()) {
      setError("El destino del proxy es obligatorio.");
      return;
    }
    if (ssl === "custom" && https) {
      if (!sslCustomCert.trim() || !sslCustomKey.trim()) {
        setError("Debes ingresar la ruta del certificado y la clave privada.");
        return;
      }
    }
    setError(null);
  }, [dominios, http, https, path, isProxy, proxyTarget, ssl, sslCustomCert, sslCustomKey]);

  // Lógica de visibilidad
  const showSslCustom = ssl === "custom" && https;
  const showProxy = isProxy;

  if (!open) return null;

  return (
    <div className="modal-backdrop" style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.3)", zIndex: 1000
    }}>
      <div
        className="modal"
        style={{
          background: "#fff",
          maxWidth: 480,
          margin: "60px auto",
          padding: 24,
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: 6,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Configuración Apache</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label>
            Dominios (separados por coma):
            <input type="text" value={dominios} onChange={e => setDominios(e.target.value)} />
          </label>
          <label>
            <input type="checkbox" checked={http} onChange={e => setHttp(e.target.checked)} />
            Habilitar HTTP (80)
          </label>
          <label>
            <input type="checkbox" checked={https} onChange={e => setHttps(e.target.checked)} />
            Habilitar HTTPS (443)
          </label>
          <label style={{ opacity: showProxy ? 0.5 : 1 }}>
            Path del sitio (DocumentRoot):
            <input type="text" value={path} onChange={e => setPath(e.target.value)} disabled={showProxy} />
          </label>
          <label style={{ opacity: https ? 1 : 0.5 }}>
            Certificado SSL:
            <select value={ssl} onChange={e => setSsl(e.target.value as any)} disabled={!https}>
              <option value="certbot">Certbot (Let's Encrypt)</option>
              <option value="snakeoil">Snakeoil (por defecto)</option>
              <option value="custom">Personalizado</option>
            </select>
          </label>
          {showSslCustom && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label>
                Ruta del certificado (.crt/.pem):
                <input
                  type="text"
                  placeholder="/ruta/cert.pem"
                  value={sslCustomCert}
                  onChange={e => setSslCustomCert(e.target.value)}
                  disabled={!showSslCustom}
                />
              </label>
              <label>
                Ruta de la clave privada (.key):
                <input
                  type="text"
                  placeholder="/ruta/key.pem"
                  value={sslCustomKey}
                  onChange={e => setSslCustomKey(e.target.value)}
                  disabled={!showSslCustom}
                />
              </label>
            </div>
          )}
          <label style={{ opacity: https ? 1 : 0.5 }}>
            <input
              type="checkbox"
              checked={redirect}
              onChange={e => setRedirect(e.target.checked)}
              disabled={!https}
            />
            Redirigir HTTP a HTTPS
          </label>
          <div>
            <label>
              <input
                type="radio"
                checked={!isProxy}
                onChange={() => setIsProxy(false)}
              />
              Usar DocumentRoot
            </label>
            <label style={{ marginLeft: 16 }}>
              <input
                type="radio"
                checked={isProxy}
                onChange={() => setIsProxy(true)}
              />
              Usar Proxy Inverso
            </label>
          </div>
          <label style={{ opacity: showProxy ? 1 : 0.5 }}>
            Proxy destino (IP:PUERTO):
            <input
              type="text"
              placeholder="127.0.0.1:3000"
              value={proxyTarget}
              onChange={e => setProxyTarget(e.target.value)}
              disabled={!showProxy}
            />
          </label>
        </div>
        {error && (
          <div className="callout alert" style={{ marginTop: 16, marginBottom: 0 }}>
            {error}
          </div>
        )}
        <div style={{ marginTop: 24, textAlign: "right" }}>
          <button className="button secondary" type="button" onClick={onClose}>Cerrar</button>
          <button
            className="button primary"
            type="button"
            style={{ marginLeft: 8 }}
            disabled={!!error}
            onClick={() => {
              if (onSave && !error) {
                onSave({
                  dominios,
                  http,
                  https,
                  path,
                  ssl,
                  sslCustomCert: ssl === "custom" && https ? sslCustomCert : undefined,
                  sslCustomKey: ssl === "custom" && https ? sslCustomKey : undefined,
                  sslCustom: ssl === "custom" && https ? `${sslCustomCert}::${sslCustomKey}` : undefined,
                  redirect,
                  isProxy,
                  proxyTarget,
                });
                onClose();
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

// --- Fin del modal ---

function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.3)", zIndex: 2000
    }}>
      <div className="modal" style={{
        background: "#fff",
        maxWidth: 380,
        margin: "120px auto",
        padding: 24,
        position: "relative"
      }}>
        <h4>¿Eliminar este registro?</h4>
        <p>Esta acción no se puede deshacer.</p>
        <div style={{ marginTop: 24, textAlign: "right" }}>
          <button className="button secondary" type="button" onClick={onClose}>Cancelar</button>
          <button
            className="button alert"
            type="button"
            style={{ marginLeft: 8 }}
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfPreviewModal({
  open,
  onClose,
  config,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  config?: ApacheConfig;
  onSave?: (filename: string, content: string, saveDir: string | null) => Promise<boolean | void>;
}) {
  const { generateApacheConf } = useApacheServerUtils();
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [saveOption, setSaveOption] = useState<"default" | "custom">("default");
  const [customPath, setCustomPath] = useState<string | null>(null);
  const [workdir, setWorkdir] = useState<string>("");
  const [defaultSaveDir, setDefaultSaveDir] = useState<string>("");

  useEffect(() => {
    if (config) {
      const firstDomain = config.dominios?.split(",")[0]?.trim() || "apache";
      setFilename(`${firstDomain.replace(/\./g, "_")}.conf`);
      setContent(generateApacheConf(config));
    }
  }, [config, generateApacheConf, open]);

  useEffect(() => {
    window.settingsAPI?.getWorkdir().then((dir) => {
      setWorkdir(dir);
      setDefaultSaveDir(`${dir}/http-configs/apache`);
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
    <div className="modal-backdrop" style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.3)", zIndex: 3000
    }}>
      <div className="modal" style={{
        background: "#fff",
        maxWidth: 700,
        margin: "40px auto",
        padding: 24,
        position: "relative",
        maxHeight: "95vh",
        minHeight: 600,
        overflowY: "auto",
        borderRadius: 6,
        display: "flex",
        flexDirection: "column"
      }}>
        <h3 style={{ marginTop: 0 }}>Previsualización .conf</h3>
        <div style={{ marginBottom: 16 }}>
          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <legend style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>¿Dónde guardar?</legend>
            <label style={{ display: "block", marginBottom: 6 }}>
              <input
                type="radio"
                checked={saveOption === "default"}
                onChange={() => setSaveOption("default")}
                style={{ marginRight: 6 }}
              />
              Guardar en <span style={{ fontFamily: "monospace" }}>{defaultSaveDir}</span>
            </label>
            <label style={{ display: "block", marginBottom: 6 }}>
              <input
                type="radio"
                checked={saveOption === "custom"}
                onChange={() => setSaveOption("custom")}
                style={{ marginRight: 6 }}
              />
              Elegir otro lugar
            </label>
          </fieldset>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Nombre del archivo:
            <input
              type="text"
              value={filename}
              onChange={e => setFilename(e.target.value)}
              style={{ width: 300, marginLeft: 8 }}
            />
          </label>
        </div>
        {saveOption === "custom" && (
          <div style={{ marginBottom: 12 }}>
            <button
              className="button secondary"
              type="button"
              onClick={handleChooseCustomPath}
              style={{ marginRight: 8 }}
            >
              Elegir carpeta destino...
            </button>
            <span style={{ fontSize: 13, color: "#888" }}>
              {customPath ? customPath : "No se ha seleccionado carpeta"}
            </span>
          </div>
        )}
        <pre style={{
          background: "#222",
          color: "#fff",
          padding: 16,
          borderRadius: 4,
          maxHeight: 350,
          overflow: "auto",
          fontSize: 14,
          marginBottom: 16,
          flex: "1 1 auto"
        }}>{content}</pre>
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <button
            className="button secondary"
            type="button"
            onClick={onClose}
            style={{ marginRight: 8 }}
          >
            Cancelar
          </button>
          <button
            className="button primary"
            type="button"
            disabled={
              (saveOption === "custom" && !customPath) ||
              !filename.trim()
            }
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

function OverwriteModal({
  open,
  onClose,
  onConfirm,
  filePath,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  filePath: string;
}) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.3)", zIndex: 4000
    }}>
      <div className="modal" style={{
        background: "#fff",
        maxWidth: 420,
        margin: "120px auto",
        padding: 24,
        position: "relative",
        borderRadius: 6,
      }}>
        <h4>El archivo ya existe</h4>
        <p>
          Ya existe un archivo en:<br />
          <span style={{ fontFamily: "monospace", fontSize: 13 }}>{filePath}</span>
        </p>
        <p>¿Deseas sobreescribirlo?</p>
        <div style={{ marginTop: 24, textAlign: "right" }}>
          <button className="button secondary" type="button" onClick={onClose}>Cancelar</button>
          <button
            className="button alert"
            type="button"
            style={{ marginLeft: 8 }}
            onClick={onConfirm}
          >
            Sobrescribir
          </button>
        </div>
      </div>
    </div>
  );
}

function ApacheView() {
  const [rows, setRows] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // Modal de edición
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditData, setModalEditData] = useState<Partial<ApacheConfig> | undefined>(undefined);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Modal de confirmación de borrado
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Modal de preview .conf
  const [confModalOpen, setConfModalOpen] = useState(false);
  const [confPreviewConfig, setConfPreviewConfig] = useState<ApacheConfig | undefined>(undefined);

  // Estado para modal de sobreescritura
  const [overwriteModal, setOverwriteModal] = useState<{
    open: boolean;
    filename: string;
    content: string;
    saveDir: string | null;
    filePath: string;
    resolve?: (proceed: boolean) => void;
  }>({ open: false, filename: "", content: "", saveDir: null, filePath: "" });

  // Toast animado
  const [toast, setToast] = useState<{ visible: boolean; message: string; type?: "success" | "error" }>({ visible: false, message: "" });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type }), 3000);
  };

  useEffect(() => {
    window.apacheServersAPI?.getAll().then((data) => {
      setRows(data);
    });
  }, []);

  // Selección: click selecciona, click de nuevo deselecciona
  const handleRowClick = (idx: number) => {
    setSelectedRow(prev => (prev === idx ? null : idx));
  };

  const handleSave = async (data: ApacheConfig) => {
    if (editIndex === null) {
      const newRows = await window.apacheServersAPI.add(data);
      setRows(newRows);
    } else {
      const updatedRows = [...rows];
      updatedRows[editIndex] = data;
      await window.apacheServersAPI.saveAll(updatedRows);
      setRows(updatedRows);
    }
    setEditIndex(null);
    setSelectedRow(null);
  };

  const handleDelete = async () => {
    if (selectedRow !== null) {
      const newRows = await window.apacheServersAPI.removeAt(selectedRow);
      setRows(newRows);
      setSelectedRow(null);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div>
      <div className="grid-x align-middle" style={{ padding: "32px 0 0 0" }}>
        <div className="cell shrink" style={{ paddingLeft: 32 }}>
          <img
            src="/icons/http-servers/apache.svg"
            alt="Apache"
            style={{ width: 56, height: 56, marginRight: 12, verticalAlign: "middle" }}
          />
        </div>
        <div className="cell auto">
          <h2 style={{ fontWeight: 600, fontSize: 28, margin: 0, verticalAlign: "middle" }}>
            Configuraciones Apache
          </h2>
        </div>
        <div className="cell shrink" style={{ paddingRight: 32 }}>
          {selectedRow !== null && (
            <button
              type="button"
              title="Limpiar selección"
              className="button alert"
              style={{
                fontSize: 22,
                padding: "0 12px",
                marginLeft: 16,
                marginTop: 4,
                lineHeight: 1,
                height: 36,
                minWidth: 36,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onClick={() => setSelectedRow(null)}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="grid-x" style={{ marginTop: 32 }}>
        <div className="cell small-12" style={{ padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: 16 }}>Configuraciones</strong>
          <button
            className="button secondary"
            type="button"
            onClick={() => window.settingsAPI?.openConfigDir()}
          >
            Abrir directorio de configuraciones
          </button>
        </div>
      </div>

      <div className="grid-x" style={{ marginTop: 8 }}>
        <div className="cell small-12" style={{ padding: "0 32px" }}>
          <div className="table-scroll">
            <table
              id="apache-table"
              className="unstriped"
              style={{
                width: "100%",
                minWidth: 900,
                background: "#fff",
                padding: 16,
                border: "1px solid #ccc",
                borderRadius: 0,
              }}
            >
              <thead>
                <tr>
                  <th>Dominios</th>
                  <th>HTTP</th>
                  <th>HTTPS</th>
                  <th>Path</th>
                  <th>Proxy</th>
                  <th>SSL</th>
                  <th>Redirect</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", color: "#888" }}>
                      No hay configuraciones registradas.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => (
                    <tr
                      key={idx}
                      onClick={() => handleRowClick(idx)}
                      style={
                        selectedRow === idx
                          ? {
                              background: "#1976d2",
                              color: "#fff",
                              cursor: "pointer",
                            }
                          : { cursor: "pointer" }
                      }
                    >
                      <td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.dominios}</td>
                      <td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.http ? "80" : "—"}</td>
                      <td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.https ? "443" : "—"}</td>
                      <td style={selectedRow === idx ? { color: "#fff" } : {}}>
                        {row.path && row.path.trim() ? row.path : "—"}
                      </td>
                      <td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.isProxy ? `http://${row.proxyTarget}` : "—"}</td>
                      <td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.https ? "Sí" : "No"}</td>
                      <td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.redirect ? "301 → https" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid-x align-middle" style={{ marginTop: 16, padding: "0 32px" }}>
        <div className="cell auto">
          <button
            className="button primary"
            type="button"
            onClick={() => {
              setModalEditData(undefined);
              setEditIndex(null);
              setModalOpen(true);
            }}
          >
            Nueva
          </button>
          <button
            id="editar-btn"
            className="button secondary"
            type="button"
            style={{ marginLeft: 8 }}
            disabled={selectedRow === null}
            onClick={() => {
              if (selectedRow !== null) {
                const row = rows[selectedRow];
                setModalEditData({ ...row });
                setEditIndex(selectedRow);
                setModalOpen(true);
              }
            }}
          >
            Editar
          </button>
          <button
            id="eliminar-btn"
            className="button alert"
            type="button"
            style={{ marginLeft: 8 }}
            disabled={selectedRow === null}
            onClick={() => setDeleteModalOpen(true)}
          >
            Eliminar
          </button>
          <button
            id="directorio-conf-btn"
            className="button secondary"
            type="button"
            style={{ marginLeft: 8 }}
            disabled={selectedRow === null}
          >
            Directorio del .conf
          </button>
        </div>
        <div className="cell shrink">
          <button
            id="generar-conf-btn"
            className="button secondary"
            type="button"
            onClick={() => {
              if (selectedRow !== null) {
                setConfPreviewConfig(rows[selectedRow]);
                setConfModalOpen(true);
              }
            }}
            disabled={selectedRow === null}
          >
            Generar .conf
          </button>
        </div>
      </div>

      <ApacheConfigModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditIndex(null);
        }}
        initialData={modalEditData}
        onSave={handleSave}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      <ConfPreviewModal
        open={confModalOpen}
        onClose={() => setConfModalOpen(false)}
        config={confPreviewConfig}
        onSave={async (filename, content, saveDir) => {
          // Comprobar si existe el archivo antes de guardar
          const exists = await window.apacheServersAPI.fileExists(filename, saveDir);
          let proceed = true;
          let filePath = (saveDir || "") + "/" + filename;
          if (exists) {
            // Mostrar modal de sobreescritura y esperar confirmación
            proceed = await new Promise<boolean>((resolve) => {
              setOverwriteModal({
                open: true,
                filename,
                content,
                saveDir,
                filePath,
                resolve,
              });
            });
          }
          if (proceed) {
            const res = await window.apacheServersAPI.saveConfFile(filename, content, saveDir);
            if (res.success) {
              showToast(`Archivo guardado en:\n${res.filePath}`, "success");
              setConfModalOpen(false);
              return true;
            } else {
              showToast(`Error al guardar archivo:\n${res.error}`, "error");
              return false;
            }
          }
          // Si el usuario cancela, no guardar ni cerrar modal
          return false;
        }}
      />

      <OverwriteModal
        open={overwriteModal.open}
        filePath={overwriteModal.filePath}
        onClose={() => {
          setOverwriteModal((prev) => {
            prev.resolve?.(false);
            return { ...prev, open: false };
          });
        }}
        onConfirm={() => {
          setOverwriteModal((prev) => {
            prev.resolve?.(true);
            return { ...prev, open: false };
          });
        }}
      />

      {/* Toast animado */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            className={`callout ${toast.type === "error" ? "alert" : "success"}`}
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
              whiteSpace: "pre-line",
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
  );
}

export default ApacheView;