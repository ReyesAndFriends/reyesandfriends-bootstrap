
import { useState, useEffect } from "react";

// Asegura que TypeScript reconozca la API global
declare global {
  interface Window {
    postgresqlScriptsAPI: {
      getAll: () => Promise<any[]>;
      add: (script: any) => Promise<any[]>;
      update: (index: number, script: any) => Promise<any[]>;
      removeAt: (index: number) => Promise<any[]>;
      generateSQLFile: (index: number, filename: string, content: string, saveDir: string | null) => Promise<{ success: boolean; filePath?: string; error?: string }>;
      fileExists: (filename: string, saveDir: string | null, dbName?: string) => Promise<boolean>;
      openScriptsDir: () => Promise<string>;
    };
  }
}
import PostgreSQLScriptModal from "./components/PostgreSQLScriptModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import SQLPreviewModal from "./components/SQLPreviewModal";
import OverwriteModal from "@renderer/components/DatabaseConfigs/OverWriteModal";
import Toast from "@renderer/components/Toast";
import { usePostgreSQLDatabaseUtils, generatePostgreSQLScript } from "./usePostgreSQLDatabaseUtils";

function PostgreSQLView() {
  // Estado para la lista de scripts

  const { scripts, fetchScripts, addScript, updateScript, removeScript } = usePostgreSQLDatabaseUtils();
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  // Modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditData, setModalEditData] = useState<any | undefined>(undefined);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sqlModalOpen, setSqlModalOpen] = useState(false);
  const [sqlPreviewData, setSqlPreviewData] = useState<any | undefined>(undefined);
  const [overwriteModal, setOverwriteModal] = useState<{ open: boolean; filename: string; content: string; saveDir: string | null; filePath: string; resolve?: (proceed: boolean) => void; }>({ open: false, filename: "", content: "", saveDir: null, filePath: "" });
  const [toast, setToast] = useState<{ visible: boolean; message: string; type?: "success" | "error" }>({ visible: false, message: "" });

  // Toast helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type }), 3000);
  };


  // Cargar scripts al montar
  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);

  // Selección de fila
  const handleRowClick = (idx: number) => {
    setSelectedRow(prev => (prev === idx ? null : idx));
  };

  // Handlers CRUD
  const handleSave = async (data: any) => {
    if (editIndex === null) {
      await addScript(data);
    } else {
      await updateScript(editIndex, data);
    }
    setModalOpen(false);
    setEditIndex(null);
    setSelectedRow(null);
    showToast(`Script ${editIndex === null ? "creado" : "actualizado"} exitosamente.`);
  };

  const handleDelete = async () => {
    if (selectedRow !== null) {
      await removeScript(selectedRow);
    }
    setDeleteModalOpen(false);
    setSelectedRow(null);
    showToast("Script eliminado exitosamente.", "success");
  };

  return (
    <div>
      <div className="grid-x align-middle" style={{ padding: "32px 0 0 0" }}>
        <div className="cell shrink" style={{ paddingLeft: 32 }}>
          <img
            src="/icons/databases/postgresql.svg"
            alt="PostgreSQL"
            style={{ width: 56, height: 56, marginRight: 12, verticalAlign: "middle" }}
          />
        </div>
        <div className="cell auto">
          <h2 style={{ fontWeight: 600, fontSize: 28, margin: 0, verticalAlign: "middle" }}>
            Scripts PostgreSQL
          </h2>
        </div>
      </div>

      <div className="grid-x" style={{ marginTop: 32 }}>
        <div className="cell small-12" style={{ padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: 16 }}>Configuraciones</strong>
          <button
            className="button secondary"
            type="button"
            onClick={() => window.postgresqlScriptsAPI?.openScriptsDir()}
          >
            Abrir directorio de scripts
          </button>
        </div>
      </div>

      <div className="grid-x" style={{ marginTop: 8 }}>
        <div className="cell small-12" style={{ padding: "0 32px" }}>
          <div className="table-scroll">
            <table
              id="postgresql-table"
              className="unstriped"
              style={{ width: "100%", minWidth: 900, background: "#fff", padding: 16, border: "1px solid #ccc", borderRadius: 0 }}
            >
              <thead>
                <tr>
                  <th>Base de datos</th>
                  <th>Usuario</th>
                  <th>Host</th>
                  <th>Privilegios</th>
                  <th>Preset</th>
                  <th>Codificación</th>
                </tr>
              </thead>
              <tbody>
                {scripts.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "#888" }}>
                      No hay scripts registrados.
                    </td>
                  </tr>
                ) : (
                  scripts.map((row, idx) => (
                    <tr
                      key={idx}
                      onClick={() => handleRowClick(idx)}
                      style={selectedRow === idx ? { background: "#1976d2", color: "#fff", cursor: "pointer" } : { cursor: "pointer" }}
                    >
                      <td>{row.dbName}</td>
                      <td>{row.userName}</td>
                      <td>{row.host}</td>
                      <td>{row.privileges}</td>
                      <td>{row.preset}</td>
                      <td>{row.charset}</td>
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
              setModalEditData(undefined);
              setEditIndex(null);
              setModalOpen(true);
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
                setModalEditData({ ...scripts[selectedRow] });
                setEditIndex(selectedRow);
                setModalOpen(true);
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
        <div className="cell shrink">
          <button
            className="button secondary"
            type="button"
            onClick={() => {
              if (selectedRow !== null) {
                setSqlPreviewData(scripts[selectedRow]);
                setSqlModalOpen(true);
              }
            }}
            disabled={selectedRow === null}
          >
            Generar .sql
          </button>
        </div>
      </div>

      {/* Modales y Toast */}
      <PostgreSQLScriptModal
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

      <SQLPreviewModal
        open={sqlModalOpen}
        onClose={() => setSqlModalOpen(false)}
        data={sqlPreviewData}
        onSave={async (filename, _content, saveDir) => {
          if (selectedRow === null) return;
          const config = scripts[selectedRow];
          const sql = generatePostgreSQLScript(config);
          // Comprobar si existe el archivo antes de guardar (pasar dbName)
          const exists = await window.postgresqlScriptsAPI.fileExists(filename, saveDir, config.dbName);
          let proceed = true;
          let filePath = ((saveDir || "") + "/" + (config.dbName || "") + "/" + filename).replace(/\/+/g, "/");
          if (exists) {
            proceed = await new Promise((resolve) => {
              setOverwriteModal({
                open: true,
                filename,
                content: sql,
                saveDir,
                filePath,
                resolve,
              });
            });
          }
          if (proceed) {
            const res = await window.postgresqlScriptsAPI.generateSQLFile(selectedRow, filename, sql, saveDir);
            if (res.success) {
              showToast(`Archivo guardado en:\n${res.filePath}`);
              setSqlModalOpen(false);
            } else {
              showToast(`Error al guardar archivo:\n${res.error}`, "error");
            }
          }
        }}
      />

      <OverwriteModal
        open={overwriteModal.open}
        filePath={overwriteModal.filePath}
        onClose={() => {
          setOverwriteModal((prev) => {
            prev.resolve?.(false);
            return { ...prev, open: false };
          });
        }}
        onConfirm={() => {
          setOverwriteModal((prev) => {
            prev.resolve?.(true);
            return { ...prev, open: false };
          });
        }}
      />

      <Toast visible={toast.visible} message={toast.message} type={toast.type} />
    </div>
  );
}

export default PostgreSQLView;
