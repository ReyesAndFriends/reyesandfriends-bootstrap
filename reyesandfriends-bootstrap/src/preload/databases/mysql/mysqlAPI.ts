import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("mysqlScriptsAPI", {
  getAll: () => ipcRenderer.invoke("mysqlScripts:getAll"),
  add: (script: any) => ipcRenderer.invoke("mysqlScripts:add", script),
  update: (index: number, script: any) => ipcRenderer.invoke("mysqlScripts:update", index, script),
  removeAt: (index: number) => ipcRenderer.invoke("mysqlScripts:removeAt", index),
  generateSQLFile: (index: number, filename: string, content: string, saveDir: string | null) => ipcRenderer.invoke("mysqlScripts:generateSQLFile", index, filename, content, saveDir),
  fileExists: (filename: string, saveDir: string | null, dbName?: string) => ipcRenderer.invoke("mysqlScripts:fileExists", filename, saveDir, dbName),
  openScriptsDir: () => ipcRenderer.invoke("mysqlScripts:openScriptsDir"),
});
