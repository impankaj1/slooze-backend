import User, { UserCreateDTO, UserLoginDTO } from "../models/User";
import { LoginSchema, SignupSchema } from "../validators/UserValidator";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken, refreshSecret, userResponse } from "../helpers";
import userService from "../services/UserService";
import { ZodError } from "zod";
import { tokenService } from "../services/TokenService";

class AuthController {
  public static _instance: AuthController;

  public static getInstance(): AuthController {
    if (!AuthController._instance) {
      AuthController._instance = new AuthController();
    }
    return AuthController._instance;
  }

  public async signup(req: Request, res: Response): Promise<any> {
    let data: UserCreateDTO = req.body;

    try {
      data = SignupSchema.parse(data);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res
          .status(403)
          .json({ message: error.errors.map((e) => e.message).join(", ") });
      }
      return res
        .status(403)
        .json({ message: "Unexpected error occurred please try again" });
    }

    const existingUser = await userService.findUserByEmail(data.email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userService.createUser({
      ...data,
      password: hashedPassword,
    });

    if (!user) {
      return res
        .status(500)
        .json({ message: "Error Occurred while creating user" });
    }

    const { accessToken, refreshToken } = generateToken(user);

    await tokenService.createRefreshToken(refreshToken, user);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/auth/refresh",
      })
      .json({ token: accessToken, user: userResponse(user) });
  }

  public async login(req: Request, res: Response): Promise<any> {
    let data: UserLoginDTO = req.body;

    try {
      data = LoginSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(403)
          .json({ message: error.errors.map((e) => e.message).join(", ") });
      }
      return res
        .status(403)
        .json({ message: "Unexpected error occurred please try again" });
    }

    const user = await userService.findUserByEmail(data.email);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({ message: "Invalid password" });
    }

    const { accessToken, refreshToken } = generateToken(user);

    const dbRefreshToken = await tokenService.getRefreshTokenByEmail(
      user.email
    );

    if (dbRefreshToken) {
      await tokenService.deleteRefreshToken(dbRefreshToken.email);
    }

    await tokenService.createRefreshToken(refreshToken, user);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/auth/refresh",
      })
      .json({ token: accessToken, user: userResponse(user) });
  }

  public async refreshToken(req: Request, res: Response): Promise<any> {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    if (!refreshSecret) {
      return res.status(500).json({ message: "Internal server error" });
    }

    const decodedToken = jwt.verify(refreshToken, refreshSecret) as {
      email: string;
      name: string;
    };

    const dbRefreshToken = await tokenService.getRefreshTokenByEmail(
      decodedToken.email
    );

    if (!dbRefreshToken) {
      return res
        .status(404)
        .json({ message: "Refresh token not found in database" });
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      dbRefreshToken.refreshTokenHash
    );

    if (!isRefreshTokenValid) {
      return res
        .status(401)
        .json({ message: "Refresh token is invalid or expired" });
    }

    const user = await userService.findUserByEmail(dbRefreshToken.email);

    if (!user) {
      return res.status(404).json({ message: "User not found " });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateToken(user);

    await tokenService.deleteRefreshToken(user.email);

    await tokenService.createRefreshToken(newRefreshToken, user);

    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/auth/refresh",
      })
      .json({ token: accessToken });
  }

  public async logout(req: Request, res: Response): Promise<any> {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out successfully" });
  }

  public async fetchMe(req: Request, res: Response): Promise<any> {
    const { _id } = req.user;
    try {
      const user = await userService.findUserById(_id as unknown as string);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
}

const authController = AuthController.getInstance();

export default authController;
