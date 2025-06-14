import express from "express";
import { AuthController } from "../auth/auth.controller";
import { AuthService } from "../auth/auth.service";
import { EmailService } from "../email/email.service";
import { MagicLinkRepository } from "../magicLink/magicLink.repository";
import { UserRepository } from "../users/user.repository";
import prisma from "../lib/prisma";

const router = express.Router();
const emailService = new EmailService();
const userRepo = new UserRepository();
const magiclinkRepo = new MagicLinkRepository(prisma);

const service = new AuthService(emailService, userRepo, magiclinkRepo);
const controller = new AuthController(service);
router.post("/auth/request", controller.requestLink.bind(controller));

export { router };
