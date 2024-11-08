import { BrowserWindow, ipcMain, app } from "electron";
import path from "path";
import fs from "fs-extra";
const appResources = app.getPath("userData");
export default () => {
  ipcMain.on("set-title", (event, title) => {
    const webContents = event.sender;
    const window = BrowserWindow.fromWebContents(webContents);
    if (window) {
      window.setTitle(title);
    }
  });
  ipcMain.on("print", (event, printer_name) => {
    const webContents = event.sender;
    const window = BrowserWindow.fromWebContents(webContents);
    if (window) {
      window.webContents.print({ silent: true, deviceName: printer_name });
    }
  });
  ipcMain.handle("save-env-variables", async (event, data) => {
    try {
      let envContent: string = "";
      Object.keys(data).forEach((key) => {
        envContent += `${key}=${data[key]}\n`;
      });
      await fs.writeFile(path.join(appResources, ".env"), envContent);

      console.log("Env variables saved successfully.");
      const webContents = event.sender;
      const setupWindow = BrowserWindow.fromWebContents(webContents);
      if (setupWindow) {
        setupWindow.close();
      }
    } catch (err) {
      console.error("Error saving env variables:", err);
    }
  });

  ipcMain.handle("app-reload", (event) => {
    const webContents = event.sender;
    const mainWindow = BrowserWindow.fromWebContents(webContents);
    mainWindow.reload();
  });
};
