import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 5);

export const generateId = (email: string): string => {
  const username = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const suffix = nanoid();

  return `ping_${username.slice(0, 8)}${suffix}`;
};
