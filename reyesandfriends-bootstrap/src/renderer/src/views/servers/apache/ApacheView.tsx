import { useState } from "react";

// Definición del tipo ApacheConfig
type ApacheConfig = {
  dominios: string;
  http: boolean;
  https: boolean;
  path: string;
  ssl: "certbot" | "snakeoil" | "custom";
  sslCustom: string;
  redirect: boolean;
  isProxy: boolean;
  proxyTarget: string;
};

function ApacheConfigModal({
  open,
  onClose,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<ApacheConfig>;
}) {
  const [dominios, setDominios] = useState(initialData?.dominios ?? "");
  const [http, setHttp] = useState(initialData?.http ?? true);
  const [https, setHttps] = useState(initialData?.https ?? false);
  const [path, setPath] = useState(initialData?.path ?? "/var/www/html");
  const [ssl, setSsl] = useState<"certbot" | "snakeoil" | "custom">(initialData?.ssl ?? "certbot");
  const [sslCustom, setSslCustom] = useState(initialData?.sslCustom ?? "");
  const [redirect, setRedirect] = useState(initialData?.redirect ?? false);
  const [isProxy, setIsProxy] = useState(initialData?.isProxy ?? false);
  const [proxyTarget, setProxyTarget] = useState(initialData?.proxyTarget ?? "");

  // Lógica de visibilidad
  const showSslCustom = ssl === "custom" && https;
  const showProxy = isProxy;

  if (!open) return null;

  return (
    <div className="modal-backdrop" style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.3)", zIndex: 1000
    }}>
      <div className="modal" style={{
        background: "#fff",
        maxWidth: 480,
        margin: "60px auto",
        padding: 24,
        position: "relative"
      }}>
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
            <label>
              Ruta cert y key (custom):
              <input
                type="text"
                placeholder="/ruta/cert.pem::/ruta/key.pem"
                value={sslCustom}
                onChange={e => setSslCustom(e.target.value)}
                disabled={!showSslCustom}
              />
            </label>
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
        <div style={{ marginTop: 24, textAlign: "right" }}>
          <button className="button secondary" type="button" onClick={onClose}>Cerrar</button>

        </div>
      </div>
    </div>
  );
}

// --- Fin del modal ---

function ApacheView() {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // Estado para modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditData, setModalEditData] = useState<Partial<ApacheConfig> | undefined>(undefined);

  const rows = [
    {
      dominios: "ejemplo.com, www.ejemplo.com",
      http: "80",
      https: "443",
      path: "/var/www/ejemplo",
      proxy: "proxy_pass http://localhost:3000",
      ssl: "Sí",
      redirect: "301 → https",
    },
    {
      dominios: "test.local",
      http: "8080",
      https: "—",
      path: "/srv/test",
      proxy: "—",
      ssl: "No",
      redirect: "No",
    },
    {
      dominios: "demo.org",
      http: "80",
      https: "443",
      path: "/home/demo/public",
      proxy: "proxy_pass http://127.0.0.1:8081",
      ssl: "Sí",
      redirect: "302 → https",
    },
  ];

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
        <div className="cell small-12" style={{ padding: "0 32px" }}>
          <strong style={{ fontSize: 16 }}>Configuraciones</strong>
        </div>
      </div>

      <div className="grid-x" style={{ marginTop: 8 }}>
        <div className="cell small-12" style={{ padding: "0 32px" }}>
          <div className="table-scroll">
            <table
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
                {rows.map((row, idx) => (
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
                    <td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.http}</td>
                    <td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.https}</td>
                    <td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.path}</td>
                    <td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.proxy}</td>
                    <td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.ssl}</td>
                    <td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.redirect}</td>
                  </tr>
                ))}
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
                // Mapear datos de la fila seleccionada al formato del modal
                const row = rows[selectedRow];
                setModalEditData({
                  dominios: row.dominios,
                  http: row.http === "80",
                  https: row.https === "443",
                  path: row.path,
                  ssl: row.ssl === "Sí" ? "certbot" : "snakeoil",
                  sslCustom: "",
                  redirect: row.redirect !== "No",
                  isProxy: row.proxy !== "—",
                  proxyTarget: row.proxy !== "—" ? (row.proxy.match(/http:\/\/(.+)/)?.[1] ?? "") : "",
                });
                setModalOpen(true);
              }
            }}
          >
            Editar
          </button>
          <button className="button alert" type="button"  style={{ marginLeft: 8 }}>Eliminar</button>
          <button className="button secondary" type="button"  style={{ marginLeft: 8 }}>Directorio del .conf</button>
        </div>
        <div className="cell shrink">
          <button className="button secondary" type="button" >
            Generar .conf
          </button>
        </div>
      </div>

      <ApacheConfigModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={modalEditData}
      />
    </div>
  );
}

export default ApacheView;