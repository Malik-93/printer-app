import express, { Express, Request, Response, Application } from "express";
import cors from "cors";
import { name, version } from "../../package.json";
import PrinterRouter from "./router/printer.routes";
import PrinterController from "./controllers/printer.controller";
import path from "path";
import errorHandler from "./middlewares/error.handler";
import { _globals, isDev, root_dir } from "./constants";
import Ngrok from "./ngrok/Ngrok";
import Logger from "./logger";
import { config } from "./config";
import axios from "axios";
import { BrowserWindow } from "electron";
import { Server } from "http";
export default class LocalServer {
  private app: Express;
  private server: Server;
  private printerRouter;
  private printerController;
  private ADD_SERVER_HTTP;
  private mainWindow: BrowserWindow;
  private logger: Logger;

  constructor() {
    process.stdin.resume();
    process.on("SIGINT", () => {
      Ngrok.kill();
      process.exit();
    });

    process.on("uncaughtException", (error: Error) => {
      console.log("[uncaughtException]", error);
      this.logger.info("[uncaughtException]", error);
    });

    this.ADD_SERVER_HTTP = config.addServerHttp;
    this.printerController = new PrinterController();
    const printerRoutes = new PrinterRouter(this.printerController);
    this.printerRouter = printerRoutes.getRouter();
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json({ limit: "50mb" })); // Parse JSON request bodies
    this.app.use(express.static("public"));
    this.app.use(errorHandler);
    this.app.use(cors()); // Enable CORS
  }

  private setupRoutes() {
    this.app.use("/api", (_req: Request, _res: Response) => {
      return _res
        .status(200)
        .json({ active: true, message: "Printer app is up and running..." });
    });
    this.app.use(
      "/api/uploads",
      express.static(path.join(__dirname, "uploads"))
    );
    this.app.use("/api/printer", this.printerRouter);
  }

  private async sendNgrokUrl(ngrokUrl: string) {
    try {
      const storeEmail = config.storeEmail;
      _globals.store_email = config.storeEmail;

      console.log(`Current email: ${storeEmail} \n`);
      console.log(`\x1b[33m Saving ngrok url into database... \x1b[0m \n`);
      // this.mainWindow.webContents.send(
      //   "log-message",
      //   "Saving ngrok url into database..."
      // );

      const response = await axios.post(
        `${this.ADD_SERVER_HTTP}`,
        {
          servers: [
            {
              Email: storeEmail,
              Url: ngrokUrl,
            },
          ],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(
        `\x1b[33m ${response.status} - ${response.statusText} \x1b[0m \n`
      );
    } catch (error) {
      console.log(
        `\x1b[31m An error occurred while saving ngrok url into database! ${error} \x1b[0m \n`
      );
    }
  }

  public start(port: number, mainWindow: BrowserWindow) {
    this.server = this.app.listen(port, "localhost", async () => {
      try {
        this.mainWindow = mainWindow;

        this.logger = new Logger(this.mainWindow);

        const server_url = `http://localhost:${port}`;

        const ngrok_url = await Ngrok.init();

        const ngrok_version = await Ngrok.getVersion();

        console.log(
          `\x1b[35m ${name} is up and running... \x1b[0m \n\n \x1b[34mLocalUrl:\x1b[0m ${server_url} \n\n \x1b[35mNgrokUrl:\x1b[0m ${ngrok_url} \n\n \x1b[32mEnvironment:\x1b[0m ${config.env} \n\n \x1b[35mRootDirectory:\x1b[0m ${root_dir} \n\n \x1b[32mApp Version:\x1b[0m ${version} \n\n \x1b[32mNgrok Version:\x1b[0m ${ngrok_version} \n\n`
        );

        this.logger.info(`${name} is up and running...`);
        this.logger.info(`Environment: ${config.env}`);
        this.logger.info(`App Version: ${version}`);
        this.logger.info(`Ngrok Version: ${ngrok_version}`);
        this.logger.info(`NgrokUrl: ${ngrok_url}`);
        this.logger.info(`LocalUrl: ${server_url}`);

        this.mainWindow.webContents.send("ngrok-url", ngrok_url);

        if (ngrok_url) {
          _globals.ngrok_url = ngrok_url;
          await this.sendNgrokUrl(ngrok_url);
        }
      } catch (error) {
        if (typeof error === "object") error = JSON.stringify(error);
        console.log(`\x1b[31m Server couldn't start ${error}\x1b[0m`);
      }
    });
  }
  public close() {
    this.server.close();
    Ngrok.kill();
    console.log("Server Stopped");
  }
  public getExpressMainWindow(): BrowserWindow {
    return this.mainWindow;
  }
}
