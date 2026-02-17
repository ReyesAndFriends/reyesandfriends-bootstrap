import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("apacheServersAPI", {
  getAll: () => ipcRenderer.invoke("apacheServers:getAll"),
  saveAll: (data: any[]) => ipcRenderer.invoke("apacheServers:saveAll", data),
  add: (server: any) => ipcRenderer.invoke("apacheServers:add", server),
  removeAt: (index: number) => ipcRenderer.invoke("apacheServers:removeAt", index),
  saveConfFile: (
    filename: string,
    content: string,
    saveDir: string | null,
    domains?: string | string[]
  ) => ipcRenderer.invoke("apacheServers:saveConfFile", filename, content, saveDir, domains),
  fileExists: (
    filename: string,
    saveDir: string | null,
    domains?: string | string[]
  ) => ipcRenderer.invoke("apacheServers:fileExists", filename, saveDir, domains),
});
