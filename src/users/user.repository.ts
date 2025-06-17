import prisma from "../lib/prisma";
import { BadRequestError } from "../utils/error";

export class UserRepository {
  async findByEmail(email: string): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      return user;
    } catch (err) {
      console.error("Find by email error: ", err);
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      return user;
    } catch (err) {
      console.error("Find by id error: ", err);
    }
  }

  async createUser(
    id: string,
    email: string,
    timezone?: string,
    mood?: string
  ): Promise<any> {
    try {
      const user = await prisma.user.create({
        data: {
          id: id,
          email,
          lastActive: new Date(),
          timezone,
          mood,
          isActive: true,
        },
      });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  async saveRefreshToken(id: string, token: string) {
    return await prisma.user.update({
      data: {
        refreshToken: token,
      },
      where: {
        id,
      },
    });
  }
}
