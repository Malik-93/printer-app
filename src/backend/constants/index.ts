import path from "path";
import { config } from "../config";
export const port: number = parseInt(config.port || "0") || 8080;
export const isDev = config.env === "development";
export let _globals = {
  store_email: "",
  store_mac: "",
  ngrok_url: "",
};
export const root_dir = process.cwd();
export const cache_dir = path.join(root_dir, "cache-printer-app");
export const pkg_json_file = "package.json";
export const PACKAGE_JSON_PATH = path.join(__dirname, "../", pkg_json_file);
