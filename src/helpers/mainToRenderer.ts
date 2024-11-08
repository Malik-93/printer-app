import { BrowserWindow, Menu, app } from "electron";
import fs from "fs-extra";
import path from "path";
const appResources = app.getPath("userData");
const envFilePath = path.join(appResources, ".env");
export default async (mainWindow: BrowserWindow) => {
  const defaultMenu = Menu.getApplicationMenu().items;
  const menu = Menu.buildFromTemplate([
    ...defaultMenu,
    {
      label: app.name,
      submenu: [
        {
          click: async () => await getPrintersAsync(),
          label: "Get Printers",
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

  const getPrintersAsync = async (): Promise<void> => {
    const printers = await mainWindow.webContents.getPrintersAsync();
    mainWindow.webContents.send("on-printers", printers);
  };
  const parseEnvBuffer = (buffer: Buffer): { [key: string]: string } => {
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

  mainWindow.webContents.on("did-finish-load", async () => {
    await getPrintersAsync();
    const sysBuffer = await fs.readFile(envFilePath);
    const sysValues = parseEnvBuffer(sysBuffer);
    mainWindow.webContents.send("show-system-values", sysValues);
  });
};
