import { BrowserWindow, ipcMain } from "electron";

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
};
