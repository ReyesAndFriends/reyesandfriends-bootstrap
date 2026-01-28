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
    <div className="modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 2000 }}>
      <div className="modal" style={{ background: "#fff", maxWidth: 380, margin: "120px auto", padding: 24, position: "relative" }}>
        <h4>¿Eliminar este registro?</h4>
        <p>Esta acción no se puede deshacer.</p>
        <div style={{ marginTop: 24, textAlign: "right" }}>
          <button className="button secondary" type="button" onClick={onClose}>Cancelar</button>
          <button className="button alert" type="button" style={{ marginLeft: 8 }} onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
