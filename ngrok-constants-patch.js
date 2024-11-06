import path from "path";
import { app } from "electron";
export const bin = path.join(app.getPath("userData"), "bin");
export const ready = "ready";
export const token = "token";
