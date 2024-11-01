export {};
declare global {
    interface Window {
      gmd_api: {
        setTitle: (title: string) => void;
      };
    }
  }