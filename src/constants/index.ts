import path from "path";
import { config } from "../backend/config";
import { BrowserWindow } from "electron";
import WinstonLogger from "../backend/logger";
export const port: number = parseInt(config.port || "0") || 9000;
export const isDev = config.env === "development";
export let _globals = {
  store_email: "",
  store_mac: "",
  ngrok_url: "",
  mainWindow: null as BrowserWindow,
  logger: null as WinstonLogger,
};
export const root_dir = process.cwd();
export const cache_dir = path.join(root_dir, "cache-printer-app");
export const pkg_json_file = "package.json";
export const PACKAGE_JSON_PATH = path.join(__dirname, "../", pkg_json_file);
