import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../../config";

/*
 * Generates a JWT for authenticated users.
 * @param payload The payload for jwt.
 * @returns A signed JWT string.
 */
export const generateAuthToken = (payload: JwtPayload): any => {
  const accessToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresInHours as SignOptions["expiresIn"],
    algorithm: "HS256",
  });

  const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresInHours as SignOptions["expiresIn"],
    algorithm: "HS256",
  });

  console.log("==============================");
  console.log("Log from Auth Token Generation");
  console.log("\nAccess Token: ", accessToken.substring(0, 10));
  console.log("\nRefresh Token: ", refreshToken);
  console.log("\nJWT SECRET: ", config.jwtSecret + config.jwtRefreshSecret);
  console.log("==============================");

  return {
    accessToken,
    refreshToken,
  };
};
export interface JwtPayload {
  userId: string;
  email: string;
}
