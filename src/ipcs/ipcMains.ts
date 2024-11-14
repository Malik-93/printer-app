import path from "path";
import { BrowserWindow, ipcMain, app } from "electron";
import fs from "fs-extra";
import { appResources, envFilePath } from "../helpers";
import { IPC_EVENTS } from "./events";

class IPCMains {
  constructor() {
    this.initializeIPC();
  }

  // Initialize IPC handlers
  private initializeIPC() {
    ipcMain.on(IPC_EVENTS.SET_TITLE, this.setTitle);
    ipcMain.on(IPC_EVENTS.PRINT, this.print);
    ipcMain.handle(IPC_EVENTS.SAVE_ENV_VARIABLES, this.saveEnvVariables);
    ipcMain.handle(IPC_EVENTS.DELETE_ENV_VARIABLE, this.removeEnvKey);
    ipcMain.handle(IPC_EVENTS.RELOAD_APP, this.reloadApp);
    ipcMain.handle(IPC_EVENTS.SCAN_PRINTERS, this.scanPrinters);
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
  private async removeEnvKey(
    event: Electron.IpcMainInvokeEvent,
    keyToRemove: string
  ) {
    let envContent = "";
    try {
      envContent = await fs.readFile(envFilePath, "utf-8");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }

    const existingData = envContent
      .split("\n")
      .reduce((acc: { [key: string]: string }, line) => {
        const [key, ...rest] = line.split("=");
        if (key && key.trim() !== keyToRemove) {
          acc[key.trim()] = rest.join("=").trim();
        }
        return acc;
      }, {});

    const updatedEnvContent = Object.entries(existingData)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    await fs.writeFile(envFilePath, updatedEnvContent);
    console.log(`Key "${keyToRemove}" removed successfully.`);
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
    mainWindow.webContents.send(IPC_EVENTS.ON_PRINTERS, printers);
  }
}

export default IPCMains;
