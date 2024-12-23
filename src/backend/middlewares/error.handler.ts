import { Request, Response, NextFunction } from "express";
import { CustomError } from "../models/Error";
import { _globals } from "../constants";
/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */
const errorHandler = (
  err: TypeError | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = err;

  if (!(err instanceof CustomError)) {
    customError = new CustomError("Ooops, Something went wrong!!");
    customError.additionalInfo = err;
  }

  // we are not using the next function to prvent from triggering
  // the default error-handler. However, make sure you are sending a
  // response to client to prevent memory leaks in case you decide to
  // NOT use, like in this example, the NextFunction .i.e., next(new Error())
  const status = (customError as CustomError).status;
  _globals.logger.error({
    path: "/middlewares/error.handler.ts",
    error: JSON.stringify({ status, ...customError }),
  });
  res.status(status).send(customError);
};

export default errorHandler;
