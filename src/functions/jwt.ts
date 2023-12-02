import jwt from "jsonwebtoken";

export const createJWT = (
  payload: Record<string, string | number | (string | number)[]>
) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error(
      "JWT Secret must be provided, please check environment variables."
    );
  }
  return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: "7d" });
};

export const verifyJWT = (token: string) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error(
      "JWT Secret must be provided, please check environment variables."
    );
  }
  return jwt.verify(token, JWT_SECRET);
};
