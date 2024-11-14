import fs from "fs";
import { FullRequest, FullResponse, Printer } from "ipp";
import { get_ip_from_mac } from "../utils";
import { IResponse } from "./../interfaces/printerInterface";
import { _globals } from "../constants";
export default class PrinterController {
  public print(
    _printer: string,
    copies: number,
    file: Express.Multer.File
  ): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      const message = this.print_request_validator(_printer, file);
      if (message.length)
        return resolve({
          success: false,
          statusCode: 400,
          message,
        });

      const filePath = `${file.path}`;
      const printCount = copies || 1;

      try {
        fs.readFile(
          filePath,
          async function (err: NodeJS.ErrnoException | null, data: Buffer) {
            if (err) {
              console.log(
                `\x1b[31m __[fs.readFile]__ An error accured: ${JSON.stringify(
                  err
                )} \x1b[0m \n`
              );
              reject(err);
            }

            let dest_printer_ip = _printer;

            if (!dest_printer_ip.includes(".")) {
              const { printer_ip } = await get_ip_from_mac(_printer);

              if (!printer_ip) {
                console.log(
                  `\x1b[31m '${dest_printer_ip}' Printer not found! \x1b[0m \n`
                );

                return resolve({
                  success: false,
                  statusCode: 404,
                  message: `Printer not found!!`,
                });
              }

              dest_printer_ip = printer_ip;
            }

            const printer_uri = dest_printer_ip.includes("http")
              ? dest_printer_ip
              : `http://${dest_printer_ip}:631`;

            const printer = new Printer(printer_uri, {
              uri: printer_uri,
              version: "1.0",
            });
            const msg: FullRequest = {
              "job-attributes-tag": {
                copies: printCount,
              },
              "operation-attributes-tag": {
                "requesting-user-name": "Azure",
                "job-name": "Automatic Print Job",
                "document-format": "application/pdf",
              },
              data: data,
            };
            printer.execute(
              "Print-Job",
              msg,
              (err: Error, _res: FullResponse) => {
                if (err) {
                  console.log(
                    `\x1b[31m __[printer.execute]__ An error accured: ${JSON.stringify(
                      err
                    )} \x1b[0m \n`
                  );
                  reject(err);
                } else {
                  console.log(
                    `\x1b[32m Print request has been sent to the printer successfully -> ${printer_uri} at ${new Date().toLocaleTimeString()} \x1b[0m \n`
                  );
                  resolve({
                    success: true,
                    statusCode: 200,
                    message: `Print request has been sent to the printer successfully -> ${printer_uri} at ${new Date().toLocaleTimeString()}`,
                    _res,
                  });
                }
              }
            );
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  private print_request_validator(
    printer: string,
    file: Express.Multer.File
  ): string {
    let message: string = "";
    if (!printer && (!file || !file.path)) {
      message = "Printer mac address and pdf file is required!!";
    } else if (!printer) {
      message = "Printer mac address is required!!";
    } else if (!file || !file.path) {
      message = "PDF file is required!!";
    }
    _globals.logger.info(message);
    return message;
  }
}
