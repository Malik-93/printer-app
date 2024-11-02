export {};
declare global {
  interface Window {
    gmd_api: {
      setTitle: (title: string) => void;
      onPrinters: (
        callback: (printers: Electron.PrinterInfo[]) => void
      ) => void;
    };
  }
}
