import jwt from "jsonwebtoken";
import { BadRequestError } from "../../utils/error";
import { config } from "../../config";
import { UserRepository } from "../../users/user.repository";
import { JwtPayload, generateAuthToken } from "./generateAuthToken.utils";
import dotenv from "dotenv";

dotenv.config();
const repo = new UserRepository();

// Generate a fresh token for testing
const testPayload: JwtPayload = {
  userId: "ping_johnpaula365n",
  email: "johnpauldanmachi@gmail.com",
};

const tokens = generateAuthToken(testPayload);
const token = tokens.refreshToken; // Use the freshly generated refresh token

const refreshToken = async (token: string): Promise<any> => {
  if (!token) throw new BadRequestError("No refresh token provided.");
  try {
    console.log("Using refresh secret:", config.jwtRefreshSecret);
    const payload = jwt.verify(token, config.jwtRefreshSecret) as JwtPayload; // Use config.jwtRefreshSecret, not hardcoded "world"
    const user = await repo.findById(payload.userId);
    console.log(payload);
  } catch (err: any) {
    console.error("Invalid token!", err.message);
  }
};

refreshToken(token);
