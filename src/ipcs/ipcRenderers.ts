import { BrowserWindow, Menu, app } from "electron";
import fs from "fs-extra";
import path from "path";
import MainApp from "../index";

class IPCRenderers {
  private appResources: string;
  private envFilePath: string;
  private mainWindow: BrowserWindow;

  constructor() {
    this.appResources = app.getPath("userData");
    this.envFilePath = path.join(this.appResources, ".env");
    this.mainWindow = MainApp.getMainWindow();
    this.setupMenu();
    this.initializeEvents();
  }

  // Set up the application menu with a custom "Get Printers" option
  private setupMenu() {
    const defaultMenu = Menu.getApplicationMenu()?.items || [];
    const menu = Menu.buildFromTemplate([
      ...defaultMenu,
      {
        label: app.name,
        submenu: [
          {
            click: async () => await this.getPrintersAsync(),
            label: "Get Printers",
          },
        ],
      },
    ]);
    Menu.setApplicationMenu(menu);
  }

  // Retrieve the list of printers asynchronously and send them to the renderer process
  private async getPrintersAsync(): Promise<void> {
    const printers = await this.mainWindow.webContents.getPrintersAsync();
    this.mainWindow.webContents.send("on-printers", printers);
  }

  // Parse the environment variables from a buffer
  private parseEnvBuffer(buffer: Buffer): { [key: string]: string } {
    const envObject: { [key: string]: string } = {};

    // Convert the buffer to a string and split it into lines
    buffer
      .toString()
      .trim()
      .split("\n")
      .forEach((line) => {
        const [key, value] = line.split("=");
        envObject[key] = value;
      });

    return envObject;
  }

  // Initialize the events such as "did-finish-load" to load printers and system values
  private initializeEvents() {
    this.mainWindow.webContents.on("did-finish-load", async () => {
      await this.getPrintersAsync();
      const sysBuffer = await fs.readFile(this.envFilePath);
      const sysValues = this.parseEnvBuffer(sysBuffer);
      this.mainWindow.webContents.send("show-system-values", sysValues);
    });
  }
}

export default IPCRenderers;
