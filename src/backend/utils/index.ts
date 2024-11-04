import { exec } from "child_process";
import fs from "fs";
import util from "util";
import { IRolloResults } from "../interfaces/printerInterface";
import logger from "../logger";
const _exec = util.promisify(exec);
export const unlinkFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    // console.log(`\x1b[33m Deleting file: '${filePath} \x1b[0m \n`);
    fs.unlink(filePath, (err: Error | any) => {
      if (err) {
        if (typeof err === "object") err = JSON.stringify(err);
        console.log(`\x1b[31m Error deleting file: \x1b[0m${err} \n`);
        logger.error(
          `An error accured while deleting the ${filePath} file..`,
          err
        );
      } else {
        // console.log(
        //   `\x1b[34m File ${filePath} deleted successfully.\x1b[0m \n`
        // );
        logger.info(`${filePath} file has been deleted..`);
      }
    });
  } else console.log(`\x1b[34m File ${filePath} does not exists.\x1b[0m \n`);
};

export const get_ip_from_mac = async (mac: string): Promise<IRolloResults> => {
  let result: IRolloResults = {
    printer_ip: "",
  };

  const spliter_phrase: string = "dynamic";
  const command = await _exec(`arp -a`);
  const { stdout } = command;
  const res = stdout.toLowerCase().replace(/\s/g, "");
  const split = res.split(spliter_phrase);
  for (let i = 0; i < split.length; i++) {
    if (split[i].includes(mac)) {
      result = {
        printer_ip: split[i].replace(mac, ""),
      };
    }
  }
  return result;
};
