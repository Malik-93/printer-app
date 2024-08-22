import cors from "cors";
import express, { Application } from "express";
import path from "path";
import errorHandler from "./middlewares/error.handler";
import router from "./router";

const app: Application = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static("public"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(errorHandler);
app.use(router);
export default app;
