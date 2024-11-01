import { BrowserWindow } from "electron/main";

export default (mainWindow: BrowserWindow) => {
  mainWindow.webContents.on("did-finish-load", () => {
    const printers = ["Printer1", "Printer2", "Printer3"]; // Replace with your actual printers data
    mainWindow.webContents.send("on-printers", printers);
  });
};
