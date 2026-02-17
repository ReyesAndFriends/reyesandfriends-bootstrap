import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("nginxServersAPI", {
  getAll: () => ipcRenderer.invoke("nginxServers:getAll"),
  saveAll: (data: any[]) => ipcRenderer.invoke("nginxServers:saveAll", data),
  add: (server: any) => ipcRenderer.invoke("nginxServers:add", server),
  removeAt: (index: number) => ipcRenderer.invoke("nginxServers:removeAt", index),
  saveConfFile: (
    filename: string,
    content: string,
    saveDir: string | null,
    domains?: string | string[]
  ) => ipcRenderer.invoke("nginxServers:saveConfFile", filename, content, saveDir, domains),
  fileExists: (
    filename: string,
    saveDir: string | null,
    domains?: string | string[]
  ) => ipcRenderer.invoke("nginxServers:fileExists", filename, saveDir, domains),
});
