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
      saveEnvVariables: (data: { [key: string]: string }) => void;
      showSystemValues: (
        callback: (sysVals: { [key: string]: string }) => void
      ) => void;
      reloadApp: () => void;
      scanPrinters: () => void;
      setupWindow: () => void;
      deleteEnvVariable: (key: string) => void;
    };
  }
}
