import jwt from "jsonwebtoken";
import { User } from "./models/User";

export const jwtSecret = process.env.JWT_SECRET;

export const refreshSecret = process.env.REFRESH_SECRET;

export const userResponse = (user: User) => {
  const { password, ...rest } = user;
  return rest;
};

export const generateToken = (user: User) => {
  const accessToken = jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    jwtSecret as string,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    refreshSecret as string,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};
