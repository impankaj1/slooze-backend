import mongoose, { Types } from "mongoose";
import { CartUpdateSchema } from "../validators/CartValidator";
import { CartCreateSchema } from "../validators/CartValidator";
import z from "zod";
import {
  CartItemAddSchema,
  CartItemUpdateSchema,
} from "../validators/CartItemValidator";
import { MenuItem } from "./MenuItems";

const CartItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.Mixed, required: true },
  quantity: { type: Number, required: true, min: 1 },
  restaurantId: { type: String, required: true },
  itemTotalPrice: { type: Number, required: true, min: 0 },
});

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  itemTotalPrice: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  _id: Types.ObjectId;
  userId: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new mongoose.Schema(
  {
    items: { type: [CartItemSchema], default: [] },
    totalPrice: { type: Number, required: true, default: 0 },
    userId: { type: String, required: true },
    country: { type: String, required: true },
  },
  { timestamps: true }
);

const CartModel = mongoose.model<Cart>("Cart", CartSchema);

export default CartModel;

export type CartCreateDTO = z.infer<typeof CartCreateSchema>;

export type CartUpdateDTO = z.infer<typeof CartUpdateSchema>;

export type CartItemAddDTO = z.infer<typeof CartItemAddSchema>;

export type CartItemUpdateDTO = z.infer<typeof CartItemUpdateSchema>;
