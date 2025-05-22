import { NextFunction, Request, Response } from "express";
import userService from "../services/UserService";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../helpers";
import { User } from "../models/User";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const header = req.headers.authorization;
  const token = header?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!jwtSecret) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  let decoded: Partial<User> | null = null;

  try {
    decoded = jwt.verify(token, jwtSecret) as Partial<User>;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "JWT expired" });
      return;
    }
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await userService.findUserById(decoded._id as unknown as string);
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  req.user = user;
  next();
};

export default authMiddleware;
