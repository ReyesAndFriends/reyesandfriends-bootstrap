import { useState, useEffect } from "react";
import { NginxConfig } from "../types";

function NginxConfigModal({
  open,
  onClose,
  initialData,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<NginxConfig>;
  onSave?: (data: NginxConfig) => void;
}) {
  const [domains, setDomains] = useState(initialData?.domains ?? "");
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
    setDomains(initialData?.domains ?? "");
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

  useEffect(() => {
    if (!https) {
      setRedirect(false);
      if (ssl !== "certbot") setSsl("certbot");
      setSslCustomCert("");
      setSslCustomKey("");
    }
    if (!isProxy) setProxyTarget("");
    if (ssl !== "custom") {
      setSslCustomCert("");
      setSslCustomKey("");
    }
    if (isProxy) setPath("");
    if (!isProxy && !path) setPath("/var/www/html");
  }, [https, ssl, isProxy]);

  useEffect(() => {
    const domainsList = domains.split(",").map(d => d.trim()).filter(d => d.length > 0);
    if (domainsList.length === 0) { setError("Debes ingresar al menos un dominio."); return; }
    const dominioRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (domainsList.some(d => !dominioRegex.test(d))) { setError("Todos los dominios deben tener formato válido (ej: midominio.com)."); return; }
    if (!http && !https) { setError("Debes habilitar HTTP (80), HTTPS (443) o ambos."); return; }
    if (!isProxy && !path.trim()) { setError("El path del sitio es obligatorio."); return; }
    if (isProxy && !proxyTarget.trim()) { setError("El destino del proxy es obligatorio."); return; }
    if (ssl === "custom" && https) {
      if (!sslCustomCert.trim() || !sslCustomKey.trim()) { setError("Debes ingresar la ruta del certificado y la clave privada."); return; }
    }
    setError(null);
  }, [domains, http, https, path, isProxy, proxyTarget, ssl, sslCustomCert, sslCustomKey]);

  const showSslCustom = ssl === "custom" && https;
  const showProxy = isProxy;

  if (!open) return null;

  return (
    <div className="modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 1000 }}>
      <div className="modal" style={{ background: "#fff", maxWidth: 480, margin: "60px auto", padding: 24, position: "relative", maxHeight: "90vh", overflowY: "auto", borderRadius: 6 }}>
        <h3 style={{ marginTop: 0 }}>Configuración Nginx</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label>
            Dominios (separados por coma):
            <input
              type="text"
              placeholder="Ej: midominio.com, www.otrodominio.com"
              value={domains}
              onChange={e => setDomains(e.target.value)}
            />
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
            Path del sitio (root):
            <input
              type="text"
              placeholder="Ej: /var/www/html, /srv/misitio"
              value={path}
              onChange={e => setPath(e.target.value)}
              disabled={showProxy}
            />
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
                <input type="text" placeholder="Ej: /etc/ssl/certs/misitio.pem" value={sslCustomCert} onChange={e => setSslCustomCert(e.target.value)} disabled={!showSslCustom} />
              </label>
              <label>
                Ruta de la clave privada (.key):
                <input type="text" placeholder="Ej: /etc/ssl/private/misitio.key" value={sslCustomKey} onChange={e => setSslCustomKey(e.target.value)} disabled={!showSslCustom} />
              </label>
            </div>
          )}
          <label style={{ opacity: https ? 1 : 0.5 }}>
            <input type="checkbox" checked={redirect} onChange={e => setRedirect(e.target.checked)} disabled={!https} />
            Redirigir HTTP a HTTPS
          </label>
          <div>
            <label>
              <input type="radio" checked={!isProxy} onChange={() => setIsProxy(false)} />
              Usar root
            </label>
            <label style={{ marginLeft: 16 }}>
              <input type="radio" checked={isProxy} onChange={() => setIsProxy(true)} />
              Usar Proxy Inverso
            </label>
          </div>
          <label style={{ opacity: showProxy ? 1 : 0.5 }}>
            Proxy destino (IP:PUERTO):
            <input
              type="text"
              placeholder="Ej: 127.0.0.1:3000, api.midominio.com:8080"
              value={proxyTarget}
              onChange={e => setProxyTarget(e.target.value)}
              disabled={!showProxy}
            />
          </label>
        </div>
        {error && <div className="callout alert" style={{ marginTop: 16, marginBottom: 0 }}>{error}</div>}
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
                  domains,
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

export default NginxConfigModal;