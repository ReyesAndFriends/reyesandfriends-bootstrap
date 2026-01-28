import { useState, useEffect } from "react";

const PRESET_PRIVILEGES: Record<string, string> = {
  produccion: "SELECT, INSERT, UPDATE, DELETE, CREATE, DROP",
  desarrollo: "ALL PRIVILEGES",
  solo_lectura: "SELECT",
};

function MySQLScriptModal({
  open,
  onClose,
  initialData,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  onSave?: (data: any) => void;
}) {
  // Estados para los campos del formulario
  const [dbName, setDbName] = useState(initialData?.dbName ?? "");
  const [userName, setUserName] = useState(initialData?.userName ?? "");
  const [userPassword, setUserPassword] = useState(initialData?.userPassword ?? "");
  const [privileges, setPrivileges] = useState(initialData?.privileges ?? "");
  const [host, setHost] = useState(initialData?.host ?? "localhost");
  const [preset, setPreset] = useState(initialData?.preset ?? "personalizado");
  const [charset, setCharset] = useState(initialData?.charset ?? "utf8mb4");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDbName(initialData?.dbName ?? "");
    setUserName(initialData?.userName ?? "");
    setUserPassword(initialData?.userPassword ?? "");
    setPrivileges(initialData?.privileges ?? "");
    setHost(initialData?.host ?? "localhost");
    setPreset(initialData?.preset ?? "personalizado");
    setCharset(initialData?.charset ?? "utf8mb4");
    setError(null);
  }, [open, initialData]);

  // Rellenar privilegios automáticamente según preset
  useEffect(() => {
    if (preset && preset !== "personalizado") {
      setPrivileges(PRESET_PRIVILEGES[preset] || "");
    }
    // Solo rellenar si el campo está vacío o es personalizado
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  // Validación básica
  useEffect(() => {
    if (!dbName.trim() || !userName.trim() || !userPassword.trim() || !privileges.trim() || !host.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError(null);
  }, [dbName, userName, userPassword, privileges, host]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 1000 }}>
      <div className="modal" style={{ background: "#fff", maxWidth: 480, margin: "60px auto", padding: 24, position: "relative", maxHeight: "90vh", overflowY: "auto", borderRadius: 6 }}>
        <h3 style={{ marginTop: 0 }}>Script MySQL</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label>
            Nombre de la base de datos:
            <input type="text" value={dbName} onChange={e => setDbName(e.target.value)} />
          </label>
          <label>
            Usuario:
            <input type="text" value={userName} onChange={e => setUserName(e.target.value)} />
          </label>
          <label>
            Contraseña:
            <input type="password" value={userPassword} onChange={e => setUserPassword(e.target.value)} />
            <button type="button" style={{ marginLeft: 8 }} onClick={() => setUserPassword(Math.random().toString(36).slice(-12))}>Generar segura</button>
          </label>
          <label>
            Privilegios:
            <input type="text" value={privileges} onChange={e => setPrivileges(e.target.value)} />
          </label>
          <label>
            Host:
            <select value={host} onChange={e => setHost(e.target.value)}>
              <option value="localhost">localhost</option>
              <option value="%">todos los hosts (%)</option>
              <option value="custom">personalizado</option>
            </select>
            {host === "custom" && (
              <input type="text" placeholder="Ej: 192.168.1.100" value={host !== "localhost" && host !== "%" ? host : ""} onChange={e => setHost(e.target.value)} />
            )}
          </label>
          <label>
            Preset:
            <select value={preset} onChange={e => setPreset(e.target.value)}>
              <option value="personalizado">personalizado</option>
              <option value="produccion">producción</option>
              <option value="desarrollo">desarrollo</option>
              <option value="solo_lectura">solo_lectura</option>
            </select>
          </label>
          <label>
            Codificación (charset):
            <select value={charset} onChange={e => setCharset(e.target.value)}>
              <option value="utf8mb4">UTF-8 multibyte (recomendado)</option>
              <option value="utf8">UTF-8</option>
              <option value="latin1">Latin1</option>
              <option value="ascii">ASCII</option>
              <option value="ucs2">UCS-2</option>
              <option value="utf16">UTF-16</option>
              <option value="utf32">UTF-32</option>
            </select>
          </label>
        </div>
        {error && (
          <div className="callout alert" style={{ marginTop: 16, marginBottom: 0 }}>
            {error}
          </div>
        )}
        <div style={{ marginTop: 24, textAlign: "right" }}>
          <button className="button secondary" type="button" onClick={onClose}>Cerrar</button>
          <button className="button primary" type="button" style={{ marginLeft: 8 }} disabled={!!error} onClick={() => {
            if (onSave && !error) {
              onSave({ dbName, userName, userPassword, privileges, host, preset, charset });
              onClose();
            }
          }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MySQLScriptModal;
