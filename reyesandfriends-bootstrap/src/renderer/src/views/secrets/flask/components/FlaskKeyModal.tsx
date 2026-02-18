import { useState, useEffect } from "react";
import type { FlaskKey } from "../types";

function FlaskKeyModal({
	open,
	onClose,
	initialData,
	onSave,
}: {
	open: boolean;
	onClose: () => void;
	initialData?: FlaskKey;
	onSave?: (data: FlaskKey) => Promise<any> | void;
}) {
	// Estados para los campos del formulario
	const [name, setName] = useState(initialData?.name ?? "");
	const [value, setValue] = useState(initialData?.value ?? "");
	const [description, setDescription] = useState(initialData?.description ?? "");
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		setName(initialData?.name ?? "");
		setValue(initialData?.value ?? "");
		setDescription(initialData?.description ?? "");
		setError(null);
	}, [open, initialData]);

	// Validación básica
	useEffect(() => {
		if (!name.trim() || !value.trim()) {
			setError("Nombre y valor son obligatorios.");
			return;
		}
		setError(null);
	}, [name, value]);

	if (!open) return null;

	return (
		<div className="modal-backdrop" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 1000 }}>
			<div className="modal" style={{ background: "#fff", maxWidth: 420, margin: "60px auto", padding: 24, position: "relative", maxHeight: "90vh", overflowY: "auto", borderRadius: 6 }}>
				<h3 style={{ marginTop: 0 }}>{initialData ? "Editar clave Flask" : "Nueva clave Flask"}</h3>
				<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
					<label>
						Nombre:
						<input type="text" value={name} onChange={e => setName(e.target.value)} disabled={saving} />
					</label>
					<label>
						Valor:
						<input type="text" value={value} onChange={e => setValue(e.target.value)} disabled={saving} />
						<button
							type="button"
							className="button success"
							style={{ marginLeft: 8 }}
							onClick={() => setValue(Math.random().toString(36).slice(-24))}
							disabled={saving}
						>
							Generar segura
						</button>
					</label>
					<label>
						Descripción:
						<input type="text" value={description} onChange={e => setDescription(e.target.value)} disabled={saving} />
					</label>
				</div>
				{error && (
					<div className="callout alert" style={{ marginTop: 16, marginBottom: 0 }}>
						{error}
					</div>
				)}
				<div style={{ marginTop: 24, textAlign: "right" }}>
					<button className="button secondary" type="button" onClick={onClose} disabled={saving}>Cerrar</button>
					<button
						className="button primary"
						type="button"
						style={{ marginLeft: 8 }}
						disabled={!!error || saving}
						onClick={async () => {
							if (onSave && !error) {
								setSaving(true);
								try {
									await onSave({ name, value, description });
									onClose();
								} finally {
									setSaving(false);
								}
							}
						}}
					>
						{saving ? "Guardando..." : "Guardar"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default FlaskKeyModal;
