import express from "express";

import { AuthController } from "../../auth/auth.controller";
import { AuthService } from "../../auth/auth.service";
import { EmailService } from "../../email/email.service";
import prisma from "../../lib/prisma";
import { MagicLinkRepository } from "../../magicLink/magicLink.repository";
import { UserRepository } from "../../users/user.repository";

const authRouter = express.Router();
const emailService = new EmailService();
const userRepo = new UserRepository();
const magiclinkRepo = new MagicLinkRepository(prisma);

const service = new AuthService(emailService, userRepo, magiclinkRepo);

const controller = new AuthController(service);
authRouter.post("/request", controller.requestLink.bind(controller));

authRouter.get("/verify", controller.authenticateLink.bind(controller));
authRouter.get("/refresh", controller.refreshAccessToken.bind(controller));

export { authRouter };
