import { CookieOptions, NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { BadRequestError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import { magiclink } from "../generated/prisma/index";
import { config } from "../config";

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

  async authenticateLink(req: Request, res: Response, next: NextFunction) {
    const { token } = req.query;

    if (!token) {
      throw new BadRequestError("Token is required.");
    }

    try {
      const authToken = await this.authService.authenticateWithMagicLink(
        token.toString()
      );

      res.cookie("authToken", authToken, config.cookieOptions as CookieOptions);

      res.status(StatusCodes.OK).json({ message: "You are now logged in!" });
    } catch (error) {
      next(error);
    }
  }

  async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
    const { token } = req.query;

    if (!token) {
      throw new BadRequestError("Token is required.");
    }

    try {
      const newAccessToken = await this.authService.refreshAccessToken(
        token.toString()
      );

      res.cookie(
        "authToken",
        newAccessToken,
        config.cookieOptions as CookieOptions
      );
      res
        .status(StatusCodes.OK)
        .json({ message: "Your token has been refreshed!" });
    } catch (error) {
      next(error);
    }
  }
}
