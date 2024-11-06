export {};
declare global {
  interface Window {
    ipc: {
      setTitle: (title: string) => void;
      onPrinters: (
        callback: (printers: Electron.PrinterInfo[]) => void
      ) => void;
      print: (printer_name: string) => void;
      onLogMessage: (callback: (logs: string) => void) => void;
      onNgrokUrl: (callback: (url: string) => void) => void;
    };
  }
}
