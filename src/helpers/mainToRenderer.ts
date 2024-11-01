import { BrowserWindow, Menu, app } from "electron";

export default (mainWindow: BrowserWindow) => {
  const defaultMenu = Menu.getApplicationMenu().items;
  const menu = Menu.buildFromTemplate([
    ...defaultMenu,
    {
      label: app.name,
      submenu: [
        {
          click: () => {
            const printers = ["Printer1", "Printer2", "Printer3"]; // Replace with your actual printers data
            mainWindow.webContents.send("on-printers", printers);
          },
          label: "Get Printers",
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);
};
