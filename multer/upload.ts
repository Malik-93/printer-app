import { Request } from "express";
import fs from "fs";
import multer from "multer";
interface IFile {
  fieldname?: string;
  originalname?: string | any;
}

const storage = (dirPath: string = "uploads") =>
  multer.diskStorage({
    destination: (
      req: Request,
      file: IFile,
      next: (error: any, dirPath: string) => void
    ) => {
      fs.stat(dirPath, (err, stats) => {
        if (stats) {
          next(null, dirPath);
        } else {
          fs.mkdir(dirPath, (err) => {
            if (!err) {
              next(null, dirPath);
            }
          });
        }
      });
    },
    filename: (
      req: Request,
      file: IFile,
      next: (error: any, dirPath: string) => void
    ) => {
      next(null, file.originalname);
    },
  });
const upload = (dirName: string = "uploads") =>
  multer({
    storage: storage(dirName),
  });

export default upload;
