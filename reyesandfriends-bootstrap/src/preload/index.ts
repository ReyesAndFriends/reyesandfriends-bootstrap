import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("settingsAPI", {
  getWorkdir: () => ipcRenderer.invoke("settings:getWorkdir"),
  setWorkdir: (path: string) => ipcRenderer.invoke("settings:setWorkdir", path),
  selectWorkdir: () => ipcRenderer.invoke("settings:selectWorkdir"),
  getDefaultWorkdir: () => ipcRenderer.invoke("settings:getDefaultWorkdir"),
});