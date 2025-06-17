import jwt from "jsonwebtoken";
import { config } from "../config";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/error";
import { JwtPayload } from "../auth/utils/generateAuthToken.utils";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authToken } = req.cookies;

  if (!authToken) throw new BadRequestError("Authentication required!");

  try {
    const decoded = jwt.verify(authToken, config.jwtSecret);
    req.user = decoded as JwtPayload;
  } catch (error) {
    console.log("Auth Middleware error: ", error);
    next(error);
  }
};
