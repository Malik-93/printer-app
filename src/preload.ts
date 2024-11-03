// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron/renderer";
contextBridge.exposeInMainWorld("gmd_api", {
  setTitle: (title: string) => ipcRenderer.send("set-title", title),
  onPrinters: (callback: (printers: Electron.PrinterInfo[]) => void) =>
    ipcRenderer.on("on-printers", (event, printers) => callback(printers)),
  print: (printer_name: string) => ipcRenderer.send("print", printer_name),
});
