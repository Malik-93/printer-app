import net from "net";

class PrinterScanner {
  private subnet: string;
  private port: number;
  private timeout: number;

  constructor(subnet: string, port: number = 631, timeout: number = 1000) {
    this.subnet = subnet;
    this.port = port;
    this.timeout = timeout;
  }

  // Method to scan a single IP address for the specified port
  private scanPort(host: string): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();

      socket.setTimeout(this.timeout);
      socket.on("connect", () => {
        socket.destroy();
        resolve(true);
      });

      socket.on("timeout", () => {
        socket.destroy();
        resolve(false);
      });

      socket.on("error", () => {
        resolve(false);
      });

      socket.connect(this.port, host);
    });
  }

  // Method to scan the entire subnet for printers
  public async scanNetworkForPrinters(): Promise<void> {
    console.log(
      `Scanning subnet ${this.subnet} for printers on port ${this.port}...`
    );

    for (let i = 1; i <= 254; i++) {
      const ip = `${this.subnet}.${i}`;
      const isPrinter = await this.scanPort(ip);

      if (isPrinter) {
        console.log(`Printer detected on IP: ${ip}`);
      }
      console.log(`Printer not detected on IP: ${ip}`);
    }

    console.log("Scan completed.");
  }
}

export default PrinterScanner;
