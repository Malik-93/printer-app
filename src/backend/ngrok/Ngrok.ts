import { port } from "../constants";
import Logger from "../logger";
import path from "path";
import fs from "fs";
import {
  ChildProcessWithoutNullStreams,
  spawn,
} from "child_process";
import { app } from "electron";
const logger = new Logger();
class Ngrok {
  private process: ChildProcessWithoutNullStreams;
  private binaryPath: string;
  public init(): Promise<string> {
    try {
      logger.info(`[ngrok] -> Initializing tunnel...`);
      console.log(`\x1b[33m [ngrok] -> Initializing tunnel... \x1b[0m \n`);
      this.binaryPath = path.join(
        process.env.NODE_ENV === "development"
          ? __dirname
          : app.getPath("userData"),
        "bin",
        "ngrok"
      );

      // Check if the binary exists
      if (!fs.existsSync(this.binaryPath)) {
        console.error(
          "\x1b[32m Ngrok binary not found at: \x1b[0m \n",
          this.binaryPath
        );
        logger.info(`[ngrok] -> Ngrok binary not found at: ${this.binaryPath}`);
        return;
      } else {
        console.log(
          `\x1b[32m Ngrok binary found at: ${this.binaryPath} \x1b[0m \n`
        );
        logger.info(`[ngrok] -> Ngrok binary found at: ${this.binaryPath}`);
      }

      // Ensure the ngrok binary is executable
      fs.chmodSync(`${this.binaryPath}`, 0o755);

      console.log(
        `\x1b[33m Set executable permissions for ${this.binaryPath} \x1b[0m \n`
      );

      logger.info(
        `[ngrok] -> Set executable permissions for ${this.binaryPath}`
      );

      return new Promise((resolve, reject) => {
        // Spawn ngrok to start an HTTP tunnel on port 8080
        this.process = spawn(this.binaryPath, [
          "http",
          `${port}`,
          "--log=stdout",
        ]);

        this.process.on("spawn", () => {
          console.log("ngrok process spawned successfully");
        });

        this.process.stdout.on("data", (data) => {
          // Output from ngrok process
          console.log(`stdout: ${data.toString()}`);

          // Optionally, you can listen for the tunnel URL from ngrok's stdout if it's printed
          if (data.includes("url=")) {
            const match = data.toString().match(/url=(https?:\/\/\S+)/);
            if (match) {
              const tunnel_url = match[1];
              logger.info(
                `[ngrok].connect -> tunnel started at: ${tunnel_url}`
              );
              console.log(
                `\x1b[34m [ngrok].connect -> tunnel started at: ${tunnel_url}] \x1b[0m \n`
              );
              resolve(tunnel_url);
            }
          }
        });

        this.process.stderr.on("data", (data) => {
          // Error output from ngrok process
          console.error(`stderr: ${data.toString()}`);
          logger.error(`stderr: ${data.toString()}`);
        });

        this.process.on("close", (code) => {
          console.log(`ngrok process exited with code ${code}`);
          logger.info(`ngrok process exited with code ${code}`);
        });
        // Handle any errors related to spawning the process
        this.process.on("error", (err) => {
          console.error(`Failed to start ngrok process: ${err}`);
          logger.error(`Failed to start ngrok process: ${err}`);
          reject(err);
        });
      });
    } catch (error: any) {
      logger.error(`[ngrok].error -> ${error}`);
      console.log(`\x1b[31m [ngrok].error -> ${error} \x1b[0m \n`);
    }
  }
  public kill() {
    try {
      console.log("[ngrok] -> killing tunnel on app exit \n");
      logger.info("[ngrok] -> killing tunnel on app exit");

      this.process.channel.close();
      console.log("[ngrok] -> tunnel exited \n");
      logger.info("[ngrok] -> tunnel exited");
    } catch (error) {
      logger.error(`[ngrok].kill -> error: ${JSON.stringify(error)}`);
      console.log(`[ngrok].kill -> error: ${JSON.stringify(error)} \n`);
    }
  }
  public getVersion(): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        // Spawn the ngrok process with the 'version' command
        const ngrokVersion = spawn(this.binaryPath, ["version"]);

        ngrokVersion.stdout.on("data", (data) => {
          const versionStr = data.toString().trim();
          const version = versionStr.match(/\d+\.\d+\.\d+/)[0];
          resolve(version);
        });

        ngrokVersion.stderr.on("data", (data) => {
          console.error(`stderr: ${data.toString()}`);
        });

        ngrokVersion.on("close", (code) => {
          if (code !== 0) {
            console.error(`ngrok process exited with code ${code}`);
          }
        });
        ngrokVersion.on("error", (error) => reject(error));
      });
    } catch (error) {
      console.log(`[ngrok].getVersion -> error: ${JSON.stringify(error)} \n\n`);
      logger.error(`[ngrok].getVersion -> error: ${JSON.stringify(error)} \n\n`);
    }
  }
}
export default new Ngrok();
