import { config } from "../config";
import { IEmailService } from "../email/interfaces/email-service.interface";
import { MagicLinkRepository } from "../magicLink/magicLink.repository";
import { UserRepository } from "../users/user.repository";
import { BadRequestError, ForbiddenError } from "../utils/error";
import { expiresAt } from "./utils/expiresAt.util";
import { generateAuthToken, JwtPayload } from "./utils/generateAuthToken.utils";
import { generateId } from "./utils/generateId.util";
import { generateToken } from "./utils/generateToken.util";
import jwt, { Jwt } from "jsonwebtoken";
export class AuthService {
  constructor(
    private readonly emailService: IEmailService,
    private readonly userRepo: UserRepository,
    private readonly magicLinkRepo: MagicLinkRepository
  ) {}

  async requestMagicLink(email: string): Promise<void> {
    const existingUser = await this.userRepo.findByEmail(email);

    const token = generateToken();

    await this.magicLinkRepo.create({
      email,
      token,
      expiresAt: expiresAt(),
      userId: existingUser?.id ?? null,
    });

    const magicLinkUrl = `${config.appBaseUrl}/auth/magic-link/verify?token=${token}`;
    await this.emailService.send({ to: email, magicLink: magicLinkUrl });
  }

  async authenticateWithMagicLink(token: string): Promise<string> {
    const magicLink = await this.magicLinkRepo.findByToken(token);

    if (!magicLink || magicLink.used)
      throw new Error("Invalid or expired magic link.");

    if (magicLink.expiresAt < new Date()) {
      await this.magicLinkRepo.markAsUsed(magicLink.id);
      throw new Error("Magic link expired.");
    }

    let user: Awaited<ReturnType<UserRepository["findById"]>> | null = null;

    if (magicLink.userId) {
      user = await this.userRepo.findById(magicLink.userId);
    } else {
      user = await this.userRepo.findByEmail(magicLink.email);

      if (!user) {
        const userId = generateId(magicLink.email);
        user = await this.userRepo.createUser(userId, magicLink.email);
        await this.magicLinkRepo.attachUser(magicLink.id, userId);
      }
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };

    await this.magicLinkRepo.markAsUsed(magicLink.id);

    const { accessToken, refreshToken } = generateAuthToken(payload);

    await this.userRepo.saveRefreshToken(payload.userId, refreshToken);

    return accessToken;
  }

  async refreshAccessToken(token: string): Promise<string> {
    if (!token) throw new BadRequestError("No refresh token provided.");

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, config.jwtRefreshSecret) as JwtPayload;
    } catch {
      throw new ForbiddenError("Invalid or expired refresh token.");
    }

    const { email, userId } = payload;

    const { refreshtoken } = await this.userRepo.findById(userId);
    if (!refreshtoken || refreshtoken !== token) {
      throw new ForbiddenError("Invalid refresh token.");
    }

    const newAccessToken = await generateAuthToken({ email, userId });
    return newAccessToken;
  }
}
