import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const createJWT = (payload: Record<string, string>) => {
  if (!JWT_SECRET) {
    throw new Error(
      "JWT Secret must be provided, please check environment variables."
    );
  }
  return jwt.sign(payload, JWT_SECRET, { algorithm: "ES384", expiresIn: "7d" });
};

export const verifyJWT = (token: string) => {
  if (!JWT_SECRET) {
    throw new Error(
      "JWT Secret must be provided, please check environment variables."
    );
  }
  return jwt.verify(token, JWT_SECRET);
};
