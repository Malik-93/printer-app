import { contextBridge, ipcRenderer } from "electron/renderer";
import { IPC_EVENTS } from "./ipcs/events";

class PreloadAPI {
  constructor() {
    // Initialize and bind all functions to the current instance
    this.setTitle = this.setTitle.bind(this);
    this.onPrinters = this.onPrinters.bind(this);
    this.print = this.print.bind(this);
    this.onLogMessage = this.onLogMessage.bind(this);
    this.onNgrokUrl = this.onNgrokUrl.bind(this);
    this.saveEnvVariables = this.saveEnvVariables.bind(this);
    this.deleteEnvVariable = this.deleteEnvVariable.bind(this);
    this.showSystemValues = this.showSystemValues.bind(this);
    this.reloadApp = this.reloadApp.bind(this);
    this.scanPrinters = this.scanPrinters.bind(this);
    this.setupWindow = this.setupWindow.bind(this);
    this.confirmationDialog = this.confirmationDialog.bind(this);
  }

  setTitle(title: string) {
    ipcRenderer.send(IPC_EVENTS.SET_TITLE, title);
  }

  onPrinters(callback: (printers: Electron.PrinterInfo[]) => void) {
    ipcRenderer.on(IPC_EVENTS.ON_PRINTERS, (event, printers) =>
      callback(printers)
    );
  }

  print(printerName: string) {
    ipcRenderer.send(IPC_EVENTS.PRINT, printerName);
  }

  onLogMessage(callback: (message: string) => void) {
    ipcRenderer.on(IPC_EVENTS.LOG_MESSAGE, (event, message) => {
      // console.log("[preload].logMessage :", message);
      callback(message);
    });
  }

  onNgrokUrl(callback: (ngrokUrl: string) => void) {
    ipcRenderer.on(IPC_EVENTS.ON_NGROK_URL, (event, ngrokUrl) => {
      console.log("[preload].onNgrokUrl ran...");
      callback(ngrokUrl);
    });
  }

  saveEnvVariables(data: { [key: string]: string }) {
    ipcRenderer.invoke(IPC_EVENTS.SAVE_ENV_VARIABLES, data);
  }

  showSystemValues(callback: (sysVals: { [key: string]: string }) => void) {
    ipcRenderer.on(IPC_EVENTS.SHOW_SYSTEM_VALUES, (event, sysVals) =>
      callback(sysVals)
    );
  }

  deleteEnvVariable(key: string) {
    ipcRenderer.invoke(IPC_EVENTS.DELETE_ENV_VARIABLE, key);
  }

  reloadApp() {
    ipcRenderer.invoke(IPC_EVENTS.RELOAD_APP);
  }

  scanPrinters() {
    ipcRenderer.invoke(IPC_EVENTS.SCAN_PRINTERS);
  }
  setupWindow() {
    ipcRenderer.send(IPC_EVENTS.SETUP_WINDOW);
  }

  async confirmationDialog(message: string) {
    return await ipcRenderer.invoke(IPC_EVENTS.CONFIRMATION_DIALOG, message);
  }
}

// Instantiate and expose the API to the renderer process
contextBridge.exposeInMainWorld("ipc", new PreloadAPI());
