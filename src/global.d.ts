export {};
declare global {
  interface Window {
    gmd_api: {
      setTitle: (title: string) => void;
      onPrinters: (
        callback: (event: Electron.IpcRendererEvent, printers: string[]) => void
      ) => void;
    };
  }
}
