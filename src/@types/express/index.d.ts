import { Request } from "express";
import { JwtPayload } from "../../auth/utils/generateAuthToken.utils";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
