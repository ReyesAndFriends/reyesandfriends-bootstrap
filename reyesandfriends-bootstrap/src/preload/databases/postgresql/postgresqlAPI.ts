import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("postgresqlScriptsAPI", {
  getAll: () => ipcRenderer.invoke("postgresqlScripts:getAll"),
  add: (script: any) => ipcRenderer.invoke("postgresqlScripts:add", script),
  update: (index: number, script: any) => ipcRenderer.invoke("postgresqlScripts:update", index, script),
  removeAt: (index: number) => ipcRenderer.invoke("postgresqlScripts:removeAt", index),
  generateSQLFile: (index: number, filename: string, content: string, saveDir: string | null) => ipcRenderer.invoke("postgresqlScripts:generateSQLFile", index, filename, content, saveDir),
  fileExists: (filename: string, saveDir: string | null, dbName?: string) => ipcRenderer.invoke("postgresqlScripts:fileExists", filename, saveDir, dbName),
  openScriptsDir: () => ipcRenderer.invoke("postgresqlScripts:openScriptsDir"),
});
