import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { BadRequestError } from "../utils/error";
import { StatusCodes } from "http-status-codes";

export class AuthController {
  constructor(private readonly authService: AuthService) {}
  async requestLink(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError("Email is required.");
    }

    try {
      await this.authService.requestMagicLink(email);
      res
        .status(StatusCodes.OK)
        .json({ message: "Magic link sent! Check your email." });
    } catch (error) {
      //   console.error(error);
      next(error);
    }
  }
}
