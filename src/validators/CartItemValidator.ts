import { z } from "zod";
import { MenuItem } from "../models/MenuItems";
import { Types } from "mongoose";

const MenuItemSchema = z.object({
  _id: z.custom<Types.ObjectId>(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  restaurantId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CartItemAddSchema = z.object({
  menuItem: MenuItemSchema,
  quantity: z.number().min(1),
  restaurantId: z.string(),
  itemTotalPrice: z.number().min(0),
});

export const CartItemUpdateSchema = z.object({
  menuItem: MenuItemSchema,
  quantity: z.number().min(1),
  itemTotalPrice: z.number().min(0),
  restaurantId: z.string(),
});
