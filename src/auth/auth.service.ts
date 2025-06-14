import { config } from "../config";
import { IEmailService } from "../email/interfaces/email-service.interface";
import { MagicLinkRepository } from "../magicLink/magicLink.repository";
import { UserRepository } from "../users/user.repository";
import { expiresAt } from "./utils/expiresAt.util";
import { generateAuthToken } from "./utils/generateAuthToken.utils";
import { generateId } from "./utils/generateId.util";
import { generateToken } from "./utils/generateToken.util";

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
        await this.userRepo.createUser(userId, magicLink.email);
        user = await this.userRepo.findById(userId);
        await this.magicLinkRepo.attachUser(magicLink.id, userId);
      }
    }

    await this.magicLinkRepo.markAsUsed(magicLink.id);

    return generateAuthToken(user.id);
  }
}
