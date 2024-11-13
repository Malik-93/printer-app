import { BrowserWindow, app } from "electron";
import MainApp from "../index";
import { getSystemValues } from "../helpers";

class IPCRenderers {
  private mainWindow: BrowserWindow;

  constructor() {
    this.mainWindow = MainApp.getMainWindow();
    this.initializeEvents();
  }

  // Retrieve the list of printers asynchronously and send them to the renderer process
  private async getPrintersAsync(): Promise<void> {
    const printers = await this.mainWindow.webContents.getPrintersAsync();
    this.mainWindow.webContents.send("on-printers", printers);
  }

  // Initialize the events such as "did-finish-load" to load printers and system values
  private initializeEvents() {
    const getPrintersCallback = async () => {
      await this.getPrintersAsync();
      const systemValues = await getSystemValues();
      this.mainWindow.webContents.send("show-system-values", systemValues);
    };

    this.mainWindow.webContents.on("did-finish-load", getPrintersCallback);

    setInterval(getPrintersCallback, 10 * 60000); // Refresh the printers every 10 minutes
  }
}

export default IPCRenderers;
