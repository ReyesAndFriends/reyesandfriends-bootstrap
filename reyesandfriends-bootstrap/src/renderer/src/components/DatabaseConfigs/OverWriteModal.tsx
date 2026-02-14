function OverwriteModal({ open, filePath, onClose, onConfirm }: { open: boolean; filePath: string; onClose: () => void; onConfirm: () => void; }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 4000 }}>
      <div className="modal" style={{ background: "#fff", maxWidth: 520, margin: "120px auto", padding: 24, position: "relative", borderRadius: 6 }}>
        <h4>El archivo ya existe</h4>
        <p>
          Ya existe un archivo en:<br />
          <span style={{ fontFamily: "monospace", fontSize: 13, wordBreak: "break-all", fontStyle: "italic", fontWeight: "bold" }}>{filePath}</span>
        </p>
        <p style={{ textAlign: "center" }}>¿Deseas sobreescribirlo?</p>
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button className="button secondary" type="button" onClick={onClose}>Cancelar</button>
          <button className="button alert" type="button" style={{ marginLeft: 8 }} onClick={() => { onConfirm(); onClose(); }}>Sobrescribir</button>
        </div>
      </div>
    </div>
  );
}

export default OverwriteModal;
