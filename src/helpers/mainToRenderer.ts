import { BrowserWindow, Menu, app } from "electron";
export default async (mainWindow: BrowserWindow) => {
  const getPrintersAsync = async (): Promise<void> => {
    const printers = await mainWindow.webContents.getPrintersAsync();
    mainWindow.webContents.send("on-printers", printers);
  };

  mainWindow.webContents.on(
    "did-finish-load",
    async () => await getPrintersAsync()
  );

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
};
