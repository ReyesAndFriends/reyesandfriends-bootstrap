import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("settingsAPI", {
  getWorkdir: () => ipcRenderer.invoke("settings:getWorkdir"),
  setWorkdir: (path: string) => ipcRenderer.invoke("settings:setWorkdir", path),
  selectWorkdir: () => ipcRenderer.invoke("settings:selectWorkdir"),
  getDefaultWorkdir: () => ipcRenderer.invoke("settings:getDefaultWorkdir"),
});

contextBridge.exposeInMainWorld("apacheServersAPI", {
  getAll: () => ipcRenderer.invoke("apacheServers:getAll"),
  saveAll: (data: any) => ipcRenderer.invoke("apacheServers:saveAll", data),
  add: (server: any) => ipcRenderer.invoke("apacheServers:add", server),
  removeAt: (index: number) => ipcRenderer.invoke("apacheServers:removeAt", index),
});