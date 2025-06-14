import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { makeError, MakeErrorResult } from "../utils/error";

const errorHandlerMiddleware: ErrorRequestHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, statusCode }: MakeErrorResult = makeError(err);
  console.error(error);
  res.status(statusCode).json(error);
};

export default errorHandlerMiddleware;
