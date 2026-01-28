
import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Exponer MySQL Scripts API
contextBridge.exposeInMainWorld("mysqlScriptsAPI", {
  getAll: () => ipcRenderer.invoke("mysqlScripts:getAll"),
  add: (script: any) => ipcRenderer.invoke("mysqlScripts:add", script),
  update: (index: number, script: any) => ipcRenderer.invoke("mysqlScripts:update", index, script),
  removeAt: (index: number) => ipcRenderer.invoke("mysqlScripts:removeAt", index),
  generateSQLFile: (index: number, filename: string, content: string, saveDir: string | null) => ipcRenderer.invoke("mysqlScripts:generateSQLFile", index, filename, content, saveDir),
  fileExists: (filename: string, saveDir: string | null) => ipcRenderer.invoke("mysqlScripts:fileExists", filename, saveDir),
  openScriptsDir: () => ipcRenderer.invoke("mysqlScripts:openScriptsDir"),
});

contextBridge.exposeInMainWorld("electron", electronAPI);

// Exponer Settings API
contextBridge.exposeInMainWorld("settingsAPI", {
  getWorkdir: () => ipcRenderer.invoke("settings:getWorkdir"),
  setWorkdir: (path: string) => ipcRenderer.invoke("settings:setWorkdir", path),
  selectWorkdir: () => ipcRenderer.invoke("settings:selectWorkdir"),
  getDefaultWorkdir: () => ipcRenderer.invoke("settings:getDefaultWorkdir"),
  openApacheConfigDir: () => ipcRenderer.invoke("settings:openApacheConfigDir"),
  openNginxConfigDir: () => ipcRenderer.invoke("settings:openNginxConfigDir"),
});

// Exponer Apache Servers API
contextBridge.exposeInMainWorld("apacheServersAPI", {
  getAll: () => ipcRenderer.invoke("apacheServers:getAll"),
  saveAll: (data: any) => ipcRenderer.invoke("apacheServers:saveAll", data),
  add: (server: any) => ipcRenderer.invoke("apacheServers:add", server),
  removeAt: (index: number) => ipcRenderer.invoke("apacheServers:removeAt", index),
  saveConfFile: (
    filename: string,
    content: string,
    saveDir: string | null
  ) => ipcRenderer.invoke("apacheServers:saveConfFile", filename, content, saveDir),
  fileExists: (
    filename: string,
    saveDir: string | null
  ) => ipcRenderer.invoke("apacheServers:fileExists", filename, saveDir),
});

// Exponer Nginx Servers API
contextBridge.exposeInMainWorld("nginxServersAPI", {
  getAll: () => ipcRenderer.invoke("nginxServers:getAll"),
  saveAll: (data: any) => ipcRenderer.invoke("nginxServers:saveAll", data),
  add: (server: any) => ipcRenderer.invoke("nginxServers:add", server),
  removeAt: (index: number) => ipcRenderer.invoke("nginxServers:removeAt", index),
  saveConfFile: (
    filename: string,
    content: string,
    saveDir: string | null
  ) => ipcRenderer.invoke("nginxServers:saveConfFile", filename, content, saveDir),
  fileExists: (
    filename: string,
    saveDir: string | null
  ) => ipcRenderer.invoke("nginxServers:fileExists", filename, saveDir),
});