import express, { Request, Response, Router } from "express";
import printerController from "../controllers/printer.controller";
import logger from "../logger";
import upload from "../multer/upload";
import { IFormPrintRequest } from "./../interfaces/printerInterface";
import { unlinkFile } from "../utils";
const router: Router = express.Router();

router.post(
  "/print",
  upload("uploads").single("file"),
  async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;
    try {
      const body = req.body as IFormPrintRequest;
      const result = await printerController.print(
        body.printer,
        body.copies,
        file
      );
      return res.status(result.statusCode || 200).json(result);
    } catch (error) {
      // console.log(`\x1b[31m __[printer.execute]__ An error accured: ${error} \x1b[0m`)
      logger.error({
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

export = router;
