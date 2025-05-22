import mongoose, { Types } from "mongoose";

export interface RefreshToken {
  _id: Types.ObjectId;
  email: string;
  refreshTokenHash: string;
  expiresAt: Date;
  name: string;
  userId: Types.ObjectId;
}

const RefreshTokenSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  refreshTokenHash: { type: String, default: null, required: true },
  expiresAt: { type: Date, required: true },
  name: { type: String, required: true },
  userId: { type: Types.ObjectId, ref: "User", required: true },
});

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = mongoose.model(
  "RefreshToken",
  RefreshTokenSchema
);
