function OverwriteModal({ open, filePath, onClose, onConfirm }: { open: boolean; filePath: string; onClose: () => void; onConfirm: () => void; }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 1000 }}>
      <div className="modal" style={{ background: "#fff", maxWidth: 400, margin: "100px auto", padding: 24, borderRadius: 6, position: "relative" }}>
        <h4>El archivo ya existe</h4>
        <p>El archivo <b>{filePath}</b> ya existe.<br />¿Deseas sobreescribirlo?</p>
        <div style={{ marginTop: 24, textAlign: "right" }}>
          <button className="button secondary" type="button" onClick={onClose}>Cancelar</button>
          <button className="button alert" type="button" style={{ marginLeft: 8 }} onClick={() => { onConfirm(); onClose(); }}>Sobrescribir</button>
        </div>
      </div>
    </div>
  );
}

export default OverwriteModal;
