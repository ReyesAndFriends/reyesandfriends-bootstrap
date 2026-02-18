import React, { useState, useEffect } from "react";

const PRESET_PRIVILEGES: Record<string, string> = {
  produccion: "CREATE, CONNECT, TEMPORARY, SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER",
  desarrollo: "ALL PRIVILEGES",
  solo_lectura: "SELECT",
};

function PostgreSQLScriptModal({
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
  const [customHost, setCustomHost] = useState("");
  const [preset, setPreset] = useState(initialData?.preset ?? "personalizado");
  const [charset, setCharset] = useState(initialData?.charset ?? "UTF8");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setDbName(initialData?.dbName ?? "");
    setUserName(initialData?.userName ?? "");
    setUserPassword(initialData?.userPassword ?? "");
    setPrivileges(initialData?.privileges ?? "");
    setHost(initialData?.host ?? "localhost");
    setPreset(initialData?.preset ?? "personalizado");
    setCharset(initialData?.charset ?? "UTF8");
    setCustomHost("");
    setError(null);
    setShowPassword(false);
    setTouched(false);
  }, [open, initialData]);

  useEffect(() => {
    if (preset && preset !== "personalizado") {
      setPrivileges(PRESET_PRIVILEGES[preset] || "");
    }
  }, [preset]);

  useEffect(() => {
    let realHost = host === "custom" ? customHost : host;
    if (!dbName.trim() || !userName.trim() || !userPassword.trim() || !privileges.trim() || !realHost.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError(null);
  }, [dbName, userName, userPassword, privileges, host, customHost]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 1000 }}>
      <div className="modal" style={{ background: "#fff", maxWidth: 480, margin: "60px auto", padding: 24, position: "relative", maxHeight: "90vh", overflowY: "auto", borderRadius: 6 }}>
        <h3 style={{ marginTop: 0 }}>Script PostgreSQL</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label>
            Nombre de la base de datos:
            <input
              type="text"
              placeholder="ej: mi_programa_produccion"
              value={dbName}
              onChange={e => { setDbName(e.target.value); setTouched(true); }}
            />
          </label>
          <label>
            Usuario:
            <input
              type="text"
              placeholder="Nombre de usuario para la base de datos (ej: usuario_app, admin, lector)"
              value={userName}
              onChange={e => { setUserName(e.target.value); setTouched(true); }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            Contraseña:
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña segura para el usuario (ej: 8-16 caracteres, letras y números)"
                value={userPassword}
                onChange={e => { setUserPassword(e.target.value); setTouched(true); }}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="button secondary"
                style={{ marginLeft: 6, fontSize: 15, padding: "6px 18px", height: 36 }}
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <button
              type="button"
              className="button success"
              style={{ marginTop: 6, width: "fit-content", alignSelf: "flex-start", fontSize: 15, padding: "6px 18px", height: 36 }}
              onClick={() => { setUserPassword(Math.random().toString(36).slice(-12)); setTouched(true); }}
            >
              Generar segura
            </button>
          </label>
          <label>
            Preset:
            <select value={preset} onChange={e => { setPreset(e.target.value); setTouched(true); }}>
              <option value="personalizado">Personalizado</option>
              <option value="produccion">Producción</option>
              <option value="desarrollo">Desarrollo</option>
              <option value="solo_lectura">Solo lectura</option>
            </select>
          </label>
          <label>
            Privilegios:
            <input
              type="text"
              placeholder="Ej: CREATE, CONNECT, TEMPORARY, SELECT, INSERT (separados por coma)"
              value={privileges}
              onChange={e => { setPrivileges(e.target.value); setTouched(true); }}
            />
          </label>
          <label>
            Host:
            <select value={host} onChange={e => { setHost(e.target.value); setTouched(true); }}>
              <option value="localhost">localhost</option>
              <option value="%">todos los hosts (%)</option>
              <option value="custom">personalizado</option>
            </select>
            {host === "custom" && (
              <input
                type="text"
                placeholder="Dirección IP o hostname permitido (ej: 192.168.1.100, servidor.midominio.com)"
                value={customHost}
                onChange={e => { setCustomHost(e.target.value); setTouched(true); }}
              />
            )}
          </label>
          <label>
            Codificación (charset):
            <input
              type="text"
              placeholder="Ej: UTF8 (por defecto)"
              value={charset}
              onChange={e => { setCharset(e.target.value); setTouched(true); }}
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
          <button className="button primary" type="button" style={{ marginLeft: 8 }} disabled={!touched || !!error} onClick={() => {
            if (onSave && !error) {
              onSave({ dbName, userName, userPassword, privileges, host: host === "custom" ? customHost : host, preset, charset });
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

export default PostgreSQLScriptModal;
