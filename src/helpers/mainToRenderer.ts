import { BrowserWindow, Menu, app } from "electron";
// @ts-ignore
import mDnsSd from "node-dns-sd";
export default async (mainWindow: BrowserWindow) => {
  const getPrintersAsync = async (): Promise<void> => {
    const printers = await mainWindow.webContents.getPrintersAsync();
    console.log("printers", printers);
    mDnsSd
      .discover({ name: "_printer._tcp.local" })
      .then((device_list: any[]) => {
        console.log("device_list", JSON.stringify(device_list, null, "  "));
        mainWindow.webContents.send("on-printers", device_list);
      })
      .catch((error: any) => {
        console.error(error);
      });

    mDnsSd.ondata = (packet: any) => {
      console.log(JSON.stringify(packet, null, "  "));
    };

    mDnsSd
      .startMonitoring()
      .then(() => {
        console.log("Started.");
      })
      .catch((error: any) => {
        console.error(error);
      });
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
