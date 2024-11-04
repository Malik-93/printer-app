import winston from "winston";
import { config } from "./config";
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    winston.format.prettyPrint()
  ),
  defaultMeta: { service: config },
  transports: [
    new winston.transports.File({
      filename: "logs/printer-app/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "logs/printer-app/all.log" }),
    // TODO: uncomment to enable winston logging on the console
    //new winston.transports.Console(),
  ],
});

export default logger;
