import { BrowserWindow, ipcMain, app } from "electron";
import path from "path";
import fs from "fs-extra";

class IPCMains {
  private static appResources: string;

  constructor() {
    IPCMains.appResources = app.getPath("userData");
    this.initializeIPC();
  }

  // Initialize IPC handlers
  private initializeIPC() {
    ipcMain.on("set-title", this.setTitle);
    ipcMain.on("print", this.print);
    ipcMain.handle("save-env-variables", this.saveEnvVariables);
    ipcMain.handle("app-reload", this.reloadApp);
    ipcMain.handle("scan-printers", this.scanPrinters);
  }

  // Set window title
  private setTitle(event: Electron.IpcMainEvent, title: string) {
    const webContents = event.sender;
    const window = BrowserWindow.fromWebContents(webContents);
    if (window) {
      window.setTitle(title);
    }
  }

  // Print to the specified printer
  private print(event: Electron.IpcMainEvent, printer_name: string) {
    const webContents = event.sender;
    const window = BrowserWindow.fromWebContents(webContents);
    if (window) {
      window.webContents.print({ silent: true, deviceName: printer_name });
    }
  }

  // Save environment variables to file
  private async saveEnvVariables(
    event: Electron.IpcMainInvokeEvent,
    data: Record<string, string>
  ) {
    try {
      console.log("IPCMains.appResources", IPCMains.appResources);

      let envContent: string = "";
      Object.keys(data).forEach((key) => {
        envContent += `${key}=${data[key]}\n`;
      });

      await fs.writeFile(path.join(IPCMains.appResources, ".env"), envContent);

      console.log("Env variables saved successfully.");
      const webContents = event.sender;
      const setupWindow = BrowserWindow.fromWebContents(webContents);
      if (setupWindow) {
        setupWindow.close();
      }
    } catch (err) {
      console.error("Error saving env variables:", err);
    }
  }

  // Reload the main app window
  private reloadApp(event: Electron.IpcMainInvokeEvent) {
    const webContents = event.sender;
    const mainWindow = BrowserWindow.fromWebContents(webContents);
    mainWindow?.reload();
  }

  // Reload the main app window
  private async scanPrinters(event: Electron.IpcMainInvokeEvent) {
    const webContents = event.sender;
    const mainWindow = BrowserWindow.fromWebContents(webContents);
    const printers = await mainWindow.webContents.getPrintersAsync();
    mainWindow.webContents.send("on-printers", printers);
  }
}

export default IPCMains;
