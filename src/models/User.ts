import mongoose, { Types } from "mongoose";
import z from "zod";
import { LoginSchema, SignupSchema } from "../validators/UserValidator";
import { Order } from "./Order";

export enum Role {
  ADMIN = "admin",
  MANAGER = "manager",
  MEMBER = "member",
}

export interface User {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  location: string;
}

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Role,
      default: Role.MEMBER,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userModel);

export default UserModel;

export type UserCreateDTO = z.infer<typeof SignupSchema>;

export type UserLoginDTO = z.infer<typeof LoginSchema>;
export type UserUpdateDTO = Partial<UserCreateDTO>;
