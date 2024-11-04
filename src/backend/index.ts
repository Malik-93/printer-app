import { _globals, isDev } from "./constants";
import logger from "./logger";
import Ngrok from "./ngrok/Ngrok";
import axios from "axios";
import { config } from "./config";

const ADD_SERVER_HTTP = config.addServerHttp;

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
