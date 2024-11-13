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
      const envFilePath = path.join(IPCMains.appResources, ".env");

      // Read the existing .env content
      let envContent = "";
      try {
        envContent = await fs.readFile(envFilePath, "utf-8");
      } catch (error) {
        if (error.code !== "ENOENT") throw error; // Ignore if file doesn't exist
      }

      // Parse existing .env content into an object
      const existingData = envContent
        .split("\n")
        .reduce((acc: { [key: string]: string }, line) => {
          const [key, ...rest] = line.split("=");
          if (key) acc[key.trim()] = rest.join("=").trim();
          return acc;
        }, {});

      // Update existing keys or add new ones as needed
      Object.keys(data).forEach((key) => {
        existingData[key] = data[key];
      });

      // Convert merged data back to .env format
      const updatedEnvContent = Object.entries(existingData)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");

      // Write the updated content to the .env file
      await fs.writeFile(envFilePath, updatedEnvContent);
      console.log("Env variables updated successfully.");
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
