import { useState, useEffect } from "react";

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
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

function ApacheView() {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    window.apacheServersAPI?.getAll().then((data) => {
      setRows(data);
    });
  }, []);

  // Estado para modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditData, setModalEditData] = useState<Partial<ApacheConfig> | undefined>(undefined);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Estado para el modal de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Desactivar selección al hacer click fuera de la tabla
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const table = document.getElementById("apache-table");
      if (table && !table.contains(e.target as Node)) {
        setSelectedRow(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = async (data: ApacheConfig) => {
    if (editIndex === null) {
      // Crear nuevo
      const newRows = await window.apacheServersAPI.add(data);
      setRows(newRows);
    } else {
      // Editar existente
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
                      onClick={() => setSelectedRow(idx)}
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
                      <td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.path}</td>
                      <td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.isProxy ? `proxy_pass http://${row.proxyTarget}` : "—"}</td>
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
            className="button alert"
            type="button"
            style={{ marginLeft: 8 }}
            disabled={selectedRow === null}
            onClick={() => setDeleteModalOpen(true)}
          >
            Eliminar
          </button>
          <button
            className="button secondary"
            type="button"
            style={{ marginLeft: 8 }}
            disabled={selectedRow === null}
          >
            Directorio del .conf
          </button>
        </div>
        <div className="cell shrink">
          <button className="button secondary" type="button" >
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
    </div>
  );
}

export default ApacheView;