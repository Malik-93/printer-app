import express, { Request, Response, Router } from "express";
import PrinterController from "../controllers/printer.controller";
import upload from "../multer/upload";
import { IFormPrintRequest } from "./../interfaces/printerInterface";
import { unlinkFile } from "../utils";
import { _globals } from "../constants";
const router: Router = express.Router();

export default class PrinterRouter {
  private printerController: PrinterController;
  constructor(controller: PrinterController) {
    this.printerController = controller;
    this.getRouter();
  }
  get controller() {
    return this.printerController;
  }
  getRouter() {
    router.post(
      "/print",
      upload("uploads").single("file"),
      async (req: Request, res: Response) => {
        const file = req.file as Express.Multer.File;
        try {
          const body = req.body as IFormPrintRequest;
          const result = await this.printerController.print(
            body.printer,
            body.copies,
            file
          );
          return res.status(result.statusCode || 200).json(result);
        } catch (error) {
          // console.log(`\x1b[31m __[printer.execute]__ An error accured: ${error} \x1b[0m`)
          _globals.logger.error({
            endpoint: "/api/printer/print",
            error,
          });
          return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Ooops! Something went wrong...",
            error,
          });
        } finally {
          unlinkFile(file.path);
        }
      }
    );

    return router;
  }
}
