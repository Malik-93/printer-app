import express, { Express, Request, Response } from "express";
import cors from "cors";
import { name } from "../../package.json";
import PrinterRouter from "./router/printer.routes";
import PrinterController from "./controllers/printer.controller";
import path from "path";
import errorHandler from "./middlewares/error.handler";
import http from "http";
import { _globals, isDev, root_dir } from "./constants";
import Ngrok from "./ngrok/Ngrok";
import logger from "./logger";
import { config } from "./config";
export default class LocalServer {
  private app: Express;
  private printerRouter;
  private printerController;

  constructor() {
    this.printerController = new PrinterController();
    const printerRoutes = new PrinterRouter(this.printerController);
    this.printerRouter = printerRoutes.getRouter();
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  start(port: number) {
    this.app.listen(port, "localhost", async () => {
      try {
        const server_url = `http://localhost:${port}`;
        const ngrok_url = (await Ngrok.init()) as string;
        const ngrok_version = await Ngrok.getVersion();
        console.log(
          `\x1b[35m Printer app is up and running... \x1b[0m \n\n \x1b[34mLocalUrl:\x1b[0m ${server_url} \n\n \x1b[35mNgrokUrl:\x1b[0m ${ngrok_url} \n\n \x1b[32mEnvironment:\x1b[0m ${config.env} \n\n \x1b[35mRootDirectory:\x1b[0m ${root_dir} \n\n \x1b[32mApp Version:\x1b[0m 1.2.0 \n\n \x1b[32mNgrok Version:\x1b[0m ${ngrok_version} \n\n`
        );
        logger.info(
          `Printer app is up and running on \n url: ${server_url}, environment: ${config.env}, rootDirectory: ${root_dir}`
        );
        if (ngrok_url) {
          _globals.ngrok_url = ngrok_url;
          // await sendNgrokUrl(ngrok_url);
        }
      } catch (error) {
        if (typeof error === "object") error = JSON.stringify(error);
        console.log(`\x1b[31m Server couldn't start ${error}\x1b[0m`);
      }
    });
  }

  private setupMiddleware() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json({ limit: "50mb" })); // Parse JSON request bodies
    this.app.use(express.static("public"));
    this.app.use(errorHandler);
    this.app.use(cors()); // Enable CORS
  }

  private setupRoutes() {
    this.app.get("/", (_req: Request, _res: Response) => {
      return _res
        .status(200)
        .json({ active: true, message: "Printer app is up and running..." });
    });
    this.app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    this.app.use("/api/printer", this.printerRouter);
  }
}
