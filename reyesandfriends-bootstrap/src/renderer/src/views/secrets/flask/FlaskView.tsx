import { useState, useEffect } from "react";
import FlaskKeyModal from "./components/FlaskKeyModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import Toast from "@renderer/components/Toast";
import type { FlaskKey } from "./types";
import flaskIcon from "@renderer/icons/secret-keys/flask.svg";


declare global {
    interface Window {
        flaskKeysAPI: {
            getAll: () => Promise<any[]>;
            add: (key: any) => Promise<any[]>;
            update: (index: number, key: any) => Promise<any[]>;
            removeAt: (index: number) => Promise<any[]>;
        };
    }
}

function FlaskView() {
    // Estado para la lista de claves
    const [rows, setRows] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);

    // Modales
    const [modalOpen, setModalOpen] = useState(false);
    const [modalEditData, setModalEditData] = useState<FlaskKey | undefined>(undefined);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; message: string; type?: "success" | "error" }>({ visible: false, message: "" });

    // Toast helper
    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast({ visible: false, message: "", type }), 3000);
    };

    // Cargar claves al montar
    useEffect(() => {
        window.flaskKeysAPI?.getAll().then((data) => {
            if (data && typeof data === "object") {
                setRows(Object.values(data));
            } else {
                setRows([]);
            }
        });
    }, []);

    // Selección de fila
    const handleRowClick = (idx: number) => {
        setSelectedRow(prev => (prev === idx ? null : idx));
    };

    const handleSave = async (data: FlaskKey) => {
        let newRows: FlaskKey[] = [];
        if (editIndex === null) {

            const result = await window.flaskKeysAPI.add(data);
            newRows = Object.values(result);
            showToast("Clave creada exitosamente.");
        } else {

            const prev = rows[editIndex];
            if (prev && prev.name !== data.name) {
                await window.flaskKeysAPI.removeAt(editIndex);
            }
            const result = await window.flaskKeysAPI.add(data);
            newRows = Object.values(result);
            showToast("Clave actualizada exitosamente.");
        }
        setRows(newRows);
        setModalOpen(false);
        setEditIndex(null);
        setSelectedRow(null);
    };

    // Eliminar
    const handleDelete = async () => {
        if (selectedRow !== null) {
            const result = await window.flaskKeysAPI.removeAt(selectedRow);
            setRows(Object.values(result));
            showToast("Clave eliminada exitosamente.", "success");
        }
        setDeleteModalOpen(false);
        setSelectedRow(null);
    };

    return (
        <div>
            <div className="grid-x align-middle" style={{ padding: "32px 0 0 0" }}>
                <div className="cell shrink" style={{ paddingLeft: 32 }}>
                    <img
                        src={flaskIcon}
                        alt="Flask"
                        style={{ width: 56, height: 56, marginRight: 12, verticalAlign: "middle" }}
                    />
                </div>
                <div className="cell auto">
                    <h2 style={{ fontWeight: 600, fontSize: 28, margin: 0, verticalAlign: "middle" }}>
                        Secret Keys Flask
                    </h2>
                </div>
            </div>

            <div className="grid-x" style={{ marginTop: 8 }}>
                <div className="cell small-12" style={{ padding: "0 32px" }}>
                    <div className="table-scroll">
                        <table
                            id="flask-table"
                            className="unstriped"
                            style={{ width: "100%", minWidth: 900, background: "#fff", padding: 16, border: "1px solid #ccc", borderRadius: 0 }}
                        >
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Valor</th>
                                    <th>Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: "center", color: "#888" }}>
                                            No hay claves registradas.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((row, idx) => (
                                        <tr
                                            key={row.name + idx}
                                            style={{ background: selectedRow === idx ? "#e6f7ff" : undefined, cursor: "pointer" }}
                                            onClick={() => handleRowClick(idx)}
                                        >
                                            <td>{row.name}</td>
                                            <td style={{ fontFamily: "monospace" }}>{row.value}</td>
                                            <td>{row.description ? row.description : "N/A"}</td>
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
                    <button
                        className="button primary"
                        type="button"
                        onClick={() => {
                            setModalOpen(true);
                            setModalEditData(undefined);
                            setEditIndex(null);
                        }}
                    >
                        Nueva
                    </button>
                    <button
                        className="button secondary"
                        type="button"
                        style={{ marginLeft: 8 }}
                        disabled={selectedRow === null}
                        onClick={() => {
                            if (selectedRow !== null) {
                                setModalOpen(true);
                                setModalEditData(rows[selectedRow]);
                                setEditIndex(selectedRow);
                            }
                        }}
                    >
                        Editar
                    </button>
                    <button
                        className="button alert"
                        type="button"
                        style={{ marginLeft: 8 }}
                        disabled={selectedRow === null}
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        Eliminar
                    </button>
                </div>
            </div>

            <FlaskKeyModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditIndex(null);
                }}
                initialData={modalEditData}
                onSave={handleSave}
            />

            <ConfirmDeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />

            <Toast visible={toast.visible} message={toast.message} type={toast.type} />
        </div>
    );
}

export default FlaskView;