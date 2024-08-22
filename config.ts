import * as dotenv from "dotenv";
dotenv.config();
export const config = {
  addServerHttp: process.env.ADD_SERVER_HTTP,
  storeEmail: process.env.STORE_EMAIL ?? "",
  env: process.env.NODE_ENV ?? "development",
  port: process.env.PORT ?? "9000",
  PROJECT: process.env.PROJECT ?? "Printer app",
};
