// import winston from "winston";
// import { config } from "./config";

// import fs from "fs";
// import path from "path";

// const infoLogDir = path.join(process.cwd(), "/logs/printer-app");
// const errorLogDir = path.join(process.cwd(), "/logs/printer-app");

// async function createLogDir() {
//   try {
//     if (!fs.existsSync(infoLogDir)) {
//       fs.mkdirSync(infoLogDir, { recursive: true });
//     }
//     if (!fs.existsSync(errorLogDir)) {
//       fs.mkdirSync(errorLogDir, { recursive: true });
//     }
//     console.log("Log directories created successfully");
//   } catch (error) {
//     console.error("Error creating log directory:", error);
//   }
// }

// createLogDir();
// const logger = winston.createLogger({
//   level: "info",
//   format: winston.format.combine(
//     winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
//     winston.format.prettyPrint()
//   ),
//   defaultMeta: { service: config },
//   transports: [
//     new winston.transports.File({
//       filename: `${errorLogDir}/error.log`,
//       level: "error",
//     }),
//     new winston.transports.File({ filename: `${infoLogDir}/all.log` }),
//     // TODO: uncomment to enable winston logging on the console
//     //new winston.transports.Console(),
//   ],
// });
const logger = {
  info: (...args: any[]) => {},
  error: (...args: any[]) => {},
};
export default logger;
