import { _globals, isDev, port, root_dir } from "./constants";
import logger from "./logger";
import http from "http";
import app from "./app";
import Ngrok from "./ngrok/Ngrok";
import axios from "axios";
import { config } from "./config";

const ADD_SERVER_HTTP = config.addServerHttp;

const http_server = http.createServer(app);

process.stdin.resume();

process.on("SIGINT", async () => {
  await Ngrok.kill();
  process.exit();
});

process.on("uncaughtException", (error: Error) => {
  console.log("[uncaughtException]", error);
  logger.info("[uncaughtException]", error);
});

// This is for closing ngrok connection on every code changes during development.
if (isDev) {
  process.on("SIGUSR1", async () => {
    await Ngrok.kill();
    process.exit();
  });
  process.on("SIGUSR2", async () => {
    await Ngrok.kill();
    process.exit();
  });
}
http_server.listen(port, `0.0.0.0`, undefined, async () => {
  try {
    const server_url = `http://localhost:${port}`;
    const ngrok_url =
      !isDev && process.platform === "darwin"
        ? ""
        : ((await Ngrok.init()) as string);
    const ngrok_version = await Ngrok.getVersion();
    console.log(
      `\x1b[35m Printer app is up and running... \x1b[0m \n\n \x1b[34mLocalUrl:\x1b[0m ${server_url} \n\n \x1b[35mNgrokUrl:\x1b[0m ${ngrok_url} \n\n \x1b[32mEnvironment:\x1b[0m ${config.env} \n\n \x1b[35mRootDirectory:\x1b[0m ${root_dir} \n\n \x1b[32mApp Version:\x1b[0m 1.2.0 \n\n \x1b[32mNgrok Version:\x1b[0m ${ngrok_version} \n\n`
    );
    logger.info(
      `Printer app is up and running on \n url: ${server_url}, environment: ${config.env}, rootDirectory: ${root_dir}`
    );
    if (ngrok_url) {
      _globals.ngrok_url = ngrok_url;
      await sendNgrokUrl(ngrok_url);
    }
  } catch (error) {
    if (typeof error === "object") error = JSON.stringify(error);
    console.log(`\x1b[31m Server couldn't start ${error}\x1b[0m`);
  }
});

const sendNgrokUrl = async (ngrokUrl: string) => {
  try {
    const storeEmail = config.storeEmail;
    _globals.store_email = config.storeEmail;

    console.log(`Current email: ${storeEmail} \n`);
    console.log(`\x1b[33m Saving ngrok url into database... \x1b[0m \n`);

    const response = await axios.post(
      `${ADD_SERVER_HTTP}`,
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
};
