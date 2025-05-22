import MenuItemModel, { MenuItem } from "./MenuItems";
import mongoose, { Types } from "mongoose";
import { OrderCreateSchema } from "../validators/OrderValidator";
import z from "zod";

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Order {
  _id: Types.ObjectId;
  restaurantId: string;
  userId: string;
  menuItemIds: string[];
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  paymentId: string;
}

const orderModel = new mongoose.Schema(
  {
    restaurantId: { type: String, required: true },
    userId: { type: String, required: true },
    menuItemIds: { type: [String], required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: OrderStatus, required: true },
    paymentId: { type: String, required: true },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", orderModel);

export default OrderModel;

export type OrderCreateDTO = z.infer<typeof OrderCreateSchema>;

export type OrderUpdateDTO = Partial<OrderCreateDTO>;
