import { useState, useEffect } from "react";
import { generateFlaskKeyAlphaNum } from "../useGenerateFlaskKey";
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
	const [showValue, setShowValue] = useState(false);
	const [description, setDescription] = useState(initialData?.description ?? "");
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [touched, setTouched] = useState(false);

	useEffect(() => {
		setName(initialData?.name ?? "");
		setValue(initialData?.value ?? "");
		setDescription(initialData?.description ?? "");
		setError(null);
		setTouched(false);
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
						<input
							type="text"
							placeholder="Nombre identificador de la clave (ej: SECRET_KEY, JWT_SECRET, API_KEY)"
							value={name}
							onChange={e => { setName(e.target.value); setTouched(true); }}
							disabled={saving}
						/>
					</label>
					<label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
						Valor:
						<div style={{ display: "flex", alignItems: "center" }}>
							<input
								type={showValue ? "text" : "password"}
								placeholder="Valor secreto (ej: cadena aleatoria, clave secreta, token, etc.)"
								value={value}
								onChange={e => { setValue(e.target.value); setTouched(true); }}
								disabled={saving}
								style={{ flex: 1 }}
							/>
							<button
								type="button"
								className="button secondary"
								style={{ marginLeft: 6, fontSize: 15, padding: "6px 18px", height: 36 }}
								onClick={() => setShowValue(v => !v)}
								disabled={saving}
								tabIndex={-1}
							>
								{showValue ? "Ocultar" : "Mostrar"}
							</button>
						</div>
						<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
								<button
									type="button"
									className="button success"
									style={{ marginTop: 6, width: "fit-content", alignSelf: "flex-start", fontSize: 15, padding: "6px 18px", height: 36 }}
									onClick={() => { setValue(generateFlaskKeyAlphaNum(32)); setTouched(true); }}
									disabled={saving}
								>
									Generar segura
								</button>
						</div>
					</label>
					<label>
						Descripción:
						<input
							type="text"
							placeholder="Descripción opcional (ej: clave para JWT, clave de sesión, etc.)"
							value={description}
							onChange={e => { setDescription(e.target.value); setTouched(true); }}
							disabled={saving}
						/>
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
						disabled={!touched || !!error || saving}
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
