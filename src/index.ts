import { app, BrowserWindow, ipcMain, screen } from "electron";
import IPCMains from "./ipcs/ipcMains";
import IPCRenderers from "./ipcs/ipcRenderers";
import LocalServer from "./backend/server";
import path from "path";
import fs from "fs-extra";
import {
  appResources,
  checkForAppUpdates,
  envFilePath,
  getSystemValues,
} from "./helpers";
import { IPC_EVENTS } from "./ipcs/events";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

class MainApp {
  private server: LocalServer;
  private static mainWindow: BrowserWindow | null;
  private setupWindow: BrowserWindow | null;

  constructor() {
    this.server = new LocalServer();
    const ipcMains = new IPCMains();
    MainApp.mainWindow = null;
    this.setupWindow = null;

    if (require("electron-squirrel-startup")) {
      app.quit();
    }

    app.on("ready", this.onReady.bind(this));
    app.on("window-all-closed", this.onWindowAllClosed.bind(this));
    app.on("activate", this.onActivate.bind(this));
    app.on("will-continue-activity", this.onWillContinueActivity.bind(this));
    this.initSetupWindow();
  }
  private initSetupWindow() {
    ipcMain.on(IPC_EVENTS.SETUP_WINDOW, this.createSetupWindow);
  }
  public static getMainWindow(): BrowserWindow | null {
    return MainApp.mainWindow;
  }
  private async onReady() {
    try {
      await this.copyNgrokBin();
      if (fs.existsSync(envFilePath)) {
        this.createMainWindow();
      } else {
        this.createSetupWindow();
      }
    } catch (error) {
      console.error("Failed to copy ngrok binary:", error);
    }
  }

  private onWindowAllClosed() {
    if (process.platform !== "darwin") {
      app.quit();
    }
  }

  private onActivate() {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createMainWindow();
    }
  }

  private onWillContinueActivity(event: Event) {
    console.log("continue activity");
  }

  private async copyNgrokBin() {
    const sourcePath = path.join(__dirname, "bin/ngrok");
    const destinationPath = path.join(appResources, "bin/ngrok");
    await fs.copy(sourcePath, destinationPath);
    await fs.chmod(destinationPath, 0o755);
    console.log("[main.ts] Ngrok binary copied to appResources directory");
  }

  private startServer() {
    console.log("Server Starting");
    this.server.start(parseInt(process.env.PRT) || 9000);
    console.log("Server Started");
  }

  private stopLocalServer() {
    console.log("Server Stopping");
    this.server.close();
    console.log("Server Stopped");
  }

  private createMainWindow() {
    const { height, width } = screen.getPrimaryDisplay().workAreaSize;
    MainApp.mainWindow = new BrowserWindow({
      height,
      width,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });

    MainApp.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    new IPCRenderers();

    MainApp.mainWindow.webContents.on(
      "did-start-loading",
      this.stopLocalServer.bind(this)
    );

    MainApp.mainWindow.webContents.on("did-stop-loading", async () => {
      this.startServer();
      await checkForAppUpdates(MainApp.mainWindow);
    });

    // if (process.env.NODE_ENV === "development") {
    //   MainApp.mainWindow.webContents.openDevTools();
    // }
  }

  private createSetupWindow() {
    const { height, width } = screen.getPrimaryDisplay().workAreaSize;
    const setupUrl = MAIN_WINDOW_WEBPACK_ENTRY.replace(
      "main_window",
      "setup_window"
    );

    this.setupWindow = new BrowserWindow({
      height: height - 300,
      width: width - 500,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });

    this.setupWindow.loadURL(setupUrl);

    this.setupWindow.webContents.on("did-finish-load", async () => {
      const systemValues = await getSystemValues();
      this.setupWindow.webContents.send(
        IPC_EVENTS.SHOW_SYSTEM_VALUES,
        systemValues
      );
    });
    this.setupWindow.on("closed", () => {
      this.setupWindow = null;
      this.createMainWindow();
    });

    // if (process.env.NODE_ENV === "development") {
    //   this.setupWindow.webContents.openDevTools();
    // }
  }
}

// Instantiate the app controller to run the application.
new MainApp();

export default MainApp;
