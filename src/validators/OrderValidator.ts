import { z } from "zod";
import { Types } from "mongoose";
import { OrderStatus } from "../models/Order";

const MenuItemSchema = z.object({
  _id: z.custom<Types.ObjectId>(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  restaurantId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const OrderItemSchema = z.object({
  menuItem: MenuItemSchema,
  quantity: z.number().min(1),
  restaurantId: z.string(),
  itemTotalPrice: z.number().min(0),
});

export const OrderCreateSchema = z.object({
  items: z.array(OrderItemSchema),
  totalPrice: z.number().min(0),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
});

export const OrderUpdateSchema = OrderCreateSchema.partial();
