// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron/renderer";
contextBridge.exposeInMainWorld("gmd_api", {
  setTitle: (title: string) => ipcRenderer.send("set-title", title),
  onPrinters: (
    callback: (event: Electron.IpcRendererEvent, printers: string[]) => void
  ) => ipcRenderer.on("on-printers", callback),
});
