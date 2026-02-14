import { useState, useEffect } from "react";
import { NginxConfig } from "./types";
import NginxConfigModal from "./components/NginxConfigModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import ConfPreviewModal from "./components/ConfPreviewModal";
import OverwriteModal from "@renderer/components/HttpConfigs/OverWriteModal";
import Toast from "@renderer/components/Toast";

function NginxView() {
	const [rows, setRows] = useState<NginxConfig[]>([]);
	const [selectedRow, setSelectedRow] = useState<number | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalEditData, setModalEditData] = useState<Partial<NginxConfig> | undefined>(undefined);
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [confModalOpen, setConfModalOpen] = useState(false);
	const [confPreviewConfig, setConfPreviewConfig] = useState<NginxConfig | undefined>(undefined);
	const [overwriteModal, setOverwriteModal] = useState<{
		open: boolean;
		filename: string;
		content: string;
		saveDir: string | null;
		filePath: string;
		resolve?: (proceed: boolean) => void;
	}>({ open: false, filename: "", content: "", saveDir: null, filePath: "" });
	const [toast, setToast] = useState<{ visible: boolean; message: string; type?: "success" | "error" }>({ visible: false, message: "" });

	const showToast = (message: string, type: "success" | "error" = "success") => {
		setToast({ visible: true, message, type });
		setTimeout(() => setToast({ visible: false, message: "", type }), 3000);
	};

	useEffect(() => {
		window.nginxServersAPI?.getAll().then((data) => {
			setRows(data);
		});
	}, []);

	const handleRowClick = (idx: number) => {
		setSelectedRow(prev => (prev === idx ? null : idx));
	};

	const handleSave = async (data: NginxConfig) => {
		if (editIndex === null) {
			const newRows = await window.nginxServersAPI.add(data);
			setRows(newRows);
		} else {
			const updatedRows = [...rows];
			updatedRows[editIndex] = data;
			await window.nginxServersAPI.saveAll(updatedRows);
			setRows(updatedRows);
		}
		setEditIndex(null);
		setSelectedRow(null);
	};

	const handleDelete = async () => {
		if (selectedRow !== null) {
			const newRows = await window.nginxServersAPI.removeAt(selectedRow);
			setRows(newRows);
			setSelectedRow(null);
			setDeleteModalOpen(false);
		}
	};

	return (
		<div>
			<div className="grid-x align-middle" style={{ padding: "32px 0 0 0" }}>
				<div className="cell shrink" style={{ paddingLeft: 32 }}>
					<img src="/icons/http-servers/nginx.svg" alt="Nginx" style={{ width: 56, height: 56, marginRight: 12, verticalAlign: "middle" }} />
				</div>
				<div className="cell auto">
					<h2 style={{ fontWeight: 600, fontSize: 28, margin: 0, verticalAlign: "middle" }}>Configuraciones Nginx</h2>
				</div>
			</div>

			<div className="grid-x" style={{ marginTop: 32 }}>
				<div className="cell small-12" style={{ padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<strong style={{ fontSize: 16 }}>Configuraciones</strong>
					<button className="button secondary" type="button" onClick={() => window.settingsAPI?.openNginxConfigDir()}>
						Abrir directorio de configuraciones
					</button>
				</div>
			</div>

			<div className="grid-x" style={{ marginTop: 8 }}>
				<div className="cell small-12" style={{ padding: "0 32px" }}>
					<div className="table-scroll">
						<table id="nginx-table" className="unstriped" style={{ width: "100%", minWidth: 900, background: "#fff", padding: 16, border: "1px solid #ccc", borderRadius: 0 }}>
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
								{rows.length === 0 ? (
									<tr>
										<td colSpan={7} style={{ textAlign: "center", color: "#888" }}>
											No hay configuraciones registradas.
										</td>
									</tr>
								) : (
									rows.map((row, idx) => (
										<tr key={idx} onClick={() => handleRowClick(idx)} style={selectedRow === idx ? { background: "#1976d2", color: "#fff", cursor: "pointer" } : { cursor: "pointer" }}>
											<td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.domains}</td>
											<td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.http ? "80" : "—"}</td>
											<td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.https ? "443" : "—"}</td>
											<td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.path && row.path.trim() ? row.path : "—"}</td>
											<td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.isProxy ? `http://${row.proxyTarget}` : "—"}</td>
											<td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.https ? "Sí" : "No"}</td>
											<td style={selectedRow === idx ? { color: "#fff" } : {}}>{row.redirect ? "301 → https" : "No"}</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div className="grid-x align-middle" style={{ marginTop: 16, padding: "0 32px" }}>
				<div className="cell auto">
					<button className="button primary" type="button" onClick={() => { setModalEditData(undefined); setEditIndex(null); setModalOpen(true); }}>Nueva</button>
					<button id="editar-btn" className="button secondary" type="button" style={{ marginLeft: 8 }} disabled={selectedRow === null} onClick={() => {
						if (selectedRow !== null) {
							const row = rows[selectedRow];
							setModalEditData({ ...row });
							setEditIndex(selectedRow);
							setModalOpen(true);
						}
					}}>Editar</button>
					<button id="eliminar-btn" className="button alert" type="button" style={{ marginLeft: 8 }} disabled={selectedRow === null} onClick={() => setDeleteModalOpen(true)}>Eliminar</button>
				</div>
				<div className="cell shrink">
					<button id="generar-conf-btn" className="button secondary" type="button" onClick={() => {
						if (selectedRow !== null) {
							setConfPreviewConfig(rows[selectedRow]);
							setConfModalOpen(true);
						}
					}} disabled={selectedRow === null}>Generar .conf</button>
				</div>
			</div>

			<NginxConfigModal
				open={modalOpen}
				onClose={() => { setModalOpen(false); setEditIndex(null); }}
				initialData={modalEditData}
				onSave={handleSave}
			/>
			<ConfirmDeleteModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDelete} />
			<ConfPreviewModal
				open={confModalOpen}
				onClose={() => setConfModalOpen(false)}
				config={confPreviewConfig}
				onSave={async (filename, content, saveDir) => {
					const exists = await window.nginxServersAPI.fileExists(
						filename,
						saveDir,
						confPreviewConfig?.domains
					);
					let proceed = true;
					let filePath =
						((saveDir || "") +
							(confPreviewConfig?.domains
								? "/" + confPreviewConfig.domains.split(",")[0].trim().replace(/\./g, "_")
								: "") +
							"/" +
							filename
						).replace(/\/+/g, "/");
					if (exists) {
						proceed = await new Promise<boolean>((resolve) => {
							setOverwriteModal({ open: true, filename, content, saveDir, filePath, resolve });
						});
					}
					if (proceed) {
						const res = await window.nginxServersAPI.saveConfFile(
							filename,
							content,
							saveDir,
							confPreviewConfig?.domains
						);
						if (res.success) {
							showToast(`Archivo guardado en:\n${res.filePath}`, "success");
							setConfModalOpen(false);
							return true;
						} else {
							showToast(`Error al guardar archivo:\n${res.error}`, "error");
							return false;
						}
					}
					return false;
				}}
			/>
			<OverwriteModal
				open={overwriteModal.open}
				filePath={overwriteModal.filePath}
				onClose={() => { setOverwriteModal((prev) => { prev.resolve?.(false); return { ...prev, open: false }; }); }}
				onConfirm={() => { setOverwriteModal((prev) => { prev.resolve?.(true); return { ...prev, open: false }; }); }}
			/>
			<Toast visible={toast.visible} message={toast.message} type={toast.type} />
		</div>
	);
}

export default NginxView;
