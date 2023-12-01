import * as bcrypt from "bcrypt";

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

export const encryptPassword = async (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (hash: string, password: string) => {
  return bcrypt.compare(password, hash);
};
