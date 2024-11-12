import { contextBridge, ipcRenderer } from "electron/renderer";

class PreloadAPI {
  constructor() {
    // Initialize and bind all functions to the current instance
    this.setTitle = this.setTitle.bind(this);
    this.onPrinters = this.onPrinters.bind(this);
    this.print = this.print.bind(this);
    this.onLogMessage = this.onLogMessage.bind(this);
    this.onNgrokUrl = this.onNgrokUrl.bind(this);
    this.saveEnvVariables = this.saveEnvVariables.bind(this);
    this.showSystemValues = this.showSystemValues.bind(this);
    this.reloadApp = this.reloadApp.bind(this);
    this.scanPrinters = this.scanPrinters.bind(this);
    this.setupWindow = this.setupWindow.bind(this);
  }

  setTitle(title: string) {
    ipcRenderer.send("set-title", title);
  }

  onPrinters(callback: (printers: Electron.PrinterInfo[]) => void) {
    ipcRenderer.on("on-printers", (event, printers) => callback(printers));
  }

  print(printerName: string) {
    ipcRenderer.send("print", printerName);
  }

  onLogMessage(callback: (message: string) => void) {
    ipcRenderer.on("log-message", (event, message) => {
      console.log("[preload].logMessage ran...");
      callback(message);
    });
  }

  onNgrokUrl(callback: (ngrokUrl: string) => void) {
    ipcRenderer.on("ngrok-url", (event, ngrokUrl) => {
      console.log("[preload].onNgrokUrl ran...");
      callback(ngrokUrl);
    });
  }

  saveEnvVariables(data: { [key: string]: string }) {
    ipcRenderer.invoke("save-env-variables", data);
  }

  showSystemValues(callback: (sysVals: { [key: string]: string }) => void) {
    ipcRenderer.on("show-system-values", (event, sysVals) => callback(sysVals));
  }

  reloadApp() {
    ipcRenderer.invoke("app-reload");
  }

  scanPrinters() {
    ipcRenderer.invoke("scan-printers");
  }
  setupWindow() {
    ipcRenderer.send("setup-window");
  }
}

// Instantiate and expose the API to the renderer process
contextBridge.exposeInMainWorld("ipc", new PreloadAPI());
