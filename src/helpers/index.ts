import { app, autoUpdater, BrowserWindow, dialog } from "electron";
import path from "path";
import fs from "fs-extra";
import os from "os";
export const appResources = app.getPath("userData");
export const envFilePath = path.join(appResources, ".env");
const platform = os.platform() + "_" + os.arch(), // usually returns darwin_64
  version = app.getVersion(),
  channel = "stable",
  // url = `http://192.168.77.146:80/update/${platform}/${version}/${channel}`;
  url = `http://192.168.1.5:80/update/osx_64/1.0.0/stable`;
console.log("URL", url);
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
  autoUpdater.setFeedURL({
    url,
  });
  setInterval(() => {
    console.log("checkForAppUpdates ran...");
    autoUpdater.checkForUpdates();
  }, 6000);

  autoUpdater.on(
    "update-downloaded",
    async (event, releaseNotes, releaseName) => {
      console.log("update-downloaded ran...");
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
    console.log("There was a problem updating the application");
    console.error(message);
  });
};
