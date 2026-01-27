import { ipcRenderer, contextBridge } from 'electron'
import * as db from './db'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('settingsAPI', {
  getWorkdir: async () => await db.getWorkdir(),
  setWorkdir: async (path: string) => { await db.setWorkdir(path) },
  getDefaultWorkdir: async () => db.getDefaultWorkdir(),
  selectWorkdir: async () => {
    // Llama al handler del main para abrir el diálogo y obtener el path
    return await ipcRenderer.invoke('select-workdir')
  }
})

contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})
