import MenuItemModel, { MenuItem } from "./MenuItems";
import mongoose, { Types } from "mongoose";
import { OrderCreateSchema } from "../validators/OrderValidator";
import z from "zod";
import { CartItem } from "./Cart";

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// Schema for storing cart items in orders
const OrderItemSchema = new mongoose.Schema({
  menuItem: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    restaurantId: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  quantity: { type: Number, required: true, min: 1 },
  restaurantId: { type: String, required: true },
  itemTotalPrice: { type: Number, required: true, min: 0 },
});

export interface Order {
  _id: Types.ObjectId;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const orderModel = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: Object.values(OrderStatus), required: true },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<Order>("Order", orderModel);

export default OrderModel;

export type OrderCreateDTO = z.infer<typeof OrderCreateSchema>;

export type OrderUpdateDTO = Partial<OrderCreateDTO>;
