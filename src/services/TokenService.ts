import { RefreshToken, RefreshTokenModel } from "../models/RefreshToken";
import { User } from "../models/User";
import { Types } from "mongoose";
import bcrypt from "bcrypt";

class TokenService {
  public static _instance: TokenService | null;
  public static getInstance(): TokenService {
    if (!this._instance) {
      this._instance = new TokenService();
    }
    return this._instance;
  }

  public async getRefreshTokenByEmail(
    email: string
  ): Promise<RefreshToken | null> {
    const refreshToken = await RefreshTokenModel.findOne({
      email: email,
    });
    const tokenObject = refreshToken?.toObject();
    return tokenObject
      ? {
          _id: tokenObject._id,
          email: tokenObject.email,
          refreshTokenHash: tokenObject.refreshTokenHash,
          expiresAt: tokenObject.expiresAt,
          name: tokenObject.name,
          userId: tokenObject.userId as Types.ObjectId,
        }
      : null;
  }

  public async getRefreshTokenByUserId(
    userId: Types.ObjectId
  ): Promise<RefreshToken | null> {
    const refreshToken = await RefreshTokenModel.findOne({
      userId: userId,
    });
    const tokenObject = refreshToken?.toObject();
    return tokenObject
      ? {
          _id: tokenObject._id,
          email: tokenObject.email,
          refreshTokenHash: tokenObject.refreshTokenHash,
          expiresAt: tokenObject.expiresAt,
          name: tokenObject.name,
          userId: tokenObject.userId as Types.ObjectId,
        }
      : null;
  }

  public async createRefreshToken(
    token: string,
    user: User
  ): Promise<RefreshToken> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const hashedToken = await bcrypt.hash(token, 10);

    const refreshToken = await RefreshTokenModel.create({
      email: user.email,
      refreshTokenHash: hashedToken,
      expiresAt,
      name: user.name,
      userId: user._id,
    });
    const tokenObject = refreshToken.toObject();

    return {
      _id: tokenObject._id,
      email: tokenObject.email,
      refreshTokenHash: tokenObject.refreshTokenHash,
      expiresAt: tokenObject.expiresAt,
      name: tokenObject.name,
      userId: tokenObject.userId as Types.ObjectId,
    };
  }

  public async deleteRefreshToken(
    email: string
  ): Promise<Record<string, boolean>> {
    await RefreshTokenModel.deleteOne({ email: email });
    return { deleted: true };
  }
}

export const tokenService = TokenService.getInstance();
