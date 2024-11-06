import winston, { LogEntry, Logger } from "winston";
import { config } from "./config";
import { BrowserWindow, app } from "electron";
import * as fs from "fs";
import * as path from "path";

// WinstonLogger class
class WinstonLogger {
  private logger: Logger;
  private logDirectory: string;
  private mainWindow: BrowserWindow;

  constructor(mainWindow?: BrowserWindow) {
    // Set up log directory path
    this.logDirectory = path.join(
      process.env.NODE_ENV === "development"
        ? __dirname
        : app.getPath("userData"),
      "logs",
      "printer-app"
    );
    this.ensureLogDirectoryExists();

    // Initialize the logger
    this.logger = this.createLogger();
    this.mainWindow = mainWindow;
  }

  // Ensure that the log directory exists
  private ensureLogDirectoryExists(): void {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  // Custom function to run on every log entry
  private customLogFunction(log: LogEntry): void {
    console.log("Custom function triggered for log:", log.message);
    if (this.mainWindow) {
      this.mainWindow.webContents.send("log-message", `${log.message} \n`);
    }
    // You can add more custom operations here, such as remote logging, etc.
  }

  // Create and configure the logger instance
  private createLogger(): Logger {
    // Create a custom log format
    const customFormat = winston.format((info: LogEntry) => {
      this.customLogFunction(info); // Trigger the custom function for each log
      return info;
    })();

    return winston.createLogger({
      level: "info",
      format: winston.format.combine(
        customFormat, // Apply custom function to each log entry
        winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }), // Add timestamp
        winston.format.prettyPrint() // Pretty print for easier reading
      ),
      defaultMeta: { service: config }, // You can add additional metadata here
      transports: [
        new winston.transports.File({
          filename: path.join(this.logDirectory, "error.log"),
          level: "error", // Log only errors here
        }),
        new winston.transports.File({
          filename: path.join(this.logDirectory, "all.log"),
        }),
        // Uncomment this line to enable console logging during development
        // new winston.transports.Console(),
      ],
    });
  }

  // Method to log an informational message
  public info(...args: any[]): void {
    this.logger.info(args.join(" "));
  }

  // Method to log an error message
  public error(...args: any[]): void {
    this.logger.error(args.join(" "));
  }

  // Method to log a warning message
  public warn(...args: any[]): void {
    this.logger.warn(args.join(" "));
  }

  // Method to log a debug message
  public debug(...args: any[]): void {
    this.logger.debug(args.join(" "));
  }

  // Optional: Add more logging methods as needed for other log levels
}

export default WinstonLogger;
