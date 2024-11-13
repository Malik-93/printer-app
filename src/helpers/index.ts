import { app } from "electron";
import path from "path";
import fs from "fs-extra";
export const appResources = app.getPath("userData");
export const envFilePath = path.join(appResources, ".env");

// Parse the environment variables from a buffer
export const parseEnvBuffer = (buffer: Buffer): { [key: string]: string } => {
  const envObject: { [key: string]: string } = {};

  // Convert the buffer to a string and split it into lines
  buffer
    .toString()
    .trim()
    .split("\n")
    .forEach((line) => {
      const [key, value] = line.split("=");
      envObject[key] = value;
    });

  return envObject;
};

export const getSystemValues = async (): Promise<{ [key: string]: string }> => {
  if (fs.existsSync(envFilePath)) {
    const sysBuffer = await fs.readFile(envFilePath);
    return parseEnvBuffer(sysBuffer);
  }
  return {};
};
