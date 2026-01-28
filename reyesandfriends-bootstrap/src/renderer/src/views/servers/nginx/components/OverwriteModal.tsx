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
    <div className="modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 4000 }}>
      <div className="modal" style={{ background: "#fff", maxWidth: 420, margin: "120px auto", padding: 24, position: "relative", borderRadius: 6 }}>
        <h4>El archivo ya existe</h4>
        <p>
          Ya existe un archivo en:<br />
          <span style={{ fontFamily: "monospace", fontSize: 13 }}>{filePath}</span>
        </p>
        <p>¿Deseas sobreescribirlo?</p>
        <div style={{ marginTop: 24, textAlign: "right" }}>
          <button className="button secondary" type="button" onClick={onClose}>Cancelar</button>
          <button className="button alert" type="button" style={{ marginLeft: 8 }} onClick={onConfirm}>Sobrescribir</button>
        </div>
      </div>
    </div>
  );
}

export default OverwriteModal;
