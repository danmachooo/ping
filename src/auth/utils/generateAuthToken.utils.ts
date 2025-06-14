import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../../config";

/*
 * Generates a JWT for authenticated users.
 * @param userId The ID of the user.
 * @returns A signed JWT string.
 */
export const generateAuthToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresInHours as SignOptions["expiresIn"],
  });
};
