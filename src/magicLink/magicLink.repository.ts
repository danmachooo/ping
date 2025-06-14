import { PrismaClient } from "../generated/prisma";

export class MagicLinkRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: {
    email: string;
    token: string;
    expiresAt: Date;
    userId?: string | null;
  }) {
    return this.prisma.magiclink.create({
      data: {
        email: data.email,
        token: data.token,
        expiresAt: data.expiresAt,
        userId: data.userId ?? null,
      },
    });
  }

  async findByToken(token: string) {
    return this.prisma.magiclink.findUnique({
      where: { token },
    });
  }

  async markAsUsed(id: string) {
    return this.prisma.magiclink.update({
      where: { id },
      data: { used: true },
    });
  }

  async attachUser(magicLinkId: string, userId: string) {
    return this.prisma.magiclink.update({
      where: { id: magicLinkId },
      data: { userId },
    });
  }

  async deleteExpiredLinks() {
    return this.prisma.magiclink.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
        used: true,
      },
    });
  }
}
