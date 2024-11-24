import { app, autoUpdater, BrowserWindow, dialog } from "electron";
import path from "path";
import fs from "fs-extra";
import os from "os";
import WinstonLogger from "../backend/logger";
export const appResources = app.getPath("userData");
export const envFilePath = path.join(appResources, ".env");
const logger = new WinstonLogger();
const platform = os.platform() + "_" + os.arch(), // usually returns darwin_64
  version = app.getVersion(),
  channel = "stable",
  url = `http://192.168.1.5:1337/update/${platform}/${version}/${channel}`;
logger.info("URL", url);
// Parse the environment variables from a buffer
export const parseEnvBuffer = (buffer: Buffer): { [key: string]: string } => {
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
};

export const getSystemValues = async (): Promise<{ [key: string]: string }> => {
  if (fs.existsSync(envFilePath)) {
    const sysBuffer = await fs.readFile(envFilePath);
    return parseEnvBuffer(sysBuffer);
  }
  return {};
};

export const checkForAppUpdates = async (mainWindow: BrowserWindow) => {
  try {
    logger.info("Setting feed URL...");
    autoUpdater.setFeedURL({
      url,
    });

    setInterval(() => {
      logger.info("checkForUpdates interval ran...");
      autoUpdater.checkForUpdates();
    }, 60 * 1000); // 
autoUpdater.on("checking-for-update", () => logger.info("Checking for updates..."))
autoUpdater.on("update-available", () => logger.info("Update available."))
autoUpdater.on("update-not-available", () => logger.info("Update not available."))
    autoUpdater.on(
      "update-downloaded",
      async (event, releaseNotes, releaseName) => {
        logger.info("update-downloaded ran...");
        const dialogOpts: Electron.MessageBoxOptions = {
          type: "info",
          buttons: ["Restart", "Later"],
          title: "Application Update",
          message: process.platform === "win32" ? releaseNotes : releaseName,
          detail:
            "A new version has been downloaded. Restart the application to apply the updates.",
        };

        const returnValue = await dialog.showMessageBox(mainWindow, dialogOpts);
        if (returnValue.response === 0) autoUpdater.quitAndInstall();
      }
    );

    autoUpdater.on("error", (message) => {
      logger.error(`There was a problem updating the application ${message}`);
      console.error(message);
    });
  } catch (error) {
    logger.error(`Catch Block: ${error}`);
    console.error("[checkForAppUpdates] An error accured", error);
  }
};
