import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("flaskKeysAPI", {
  getAll: () => ipcRenderer.invoke("flaskKeys:getAll"),
  add: (key: any) => ipcRenderer.invoke("flaskKeys:add", key),
  update: (index: number, key: any) => ipcRenderer.invoke("flaskKeys:update", index, key),
  removeAt: (index: number) => ipcRenderer.invoke("flaskKeys:removeAt", index),
});
