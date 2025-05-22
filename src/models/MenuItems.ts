import mongoose, { Types } from "mongoose";
import {
  MenuItemCreateSchema,
  MenuItemUpdateSchema,
} from "../validators/MenuValidator";
import z from "zod";
export interface MenuItem {
  _id: Types.ObjectId;
  name: string;
  price: number;
  description: string;
}

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
});

const MenuItemModel = mongoose.model("MenuItem", MenuItemSchema);

export type MenuItemCreateDTO = z.infer<typeof MenuItemCreateSchema>;

export type MenuItemUpdateDTO = z.infer<typeof MenuItemUpdateSchema>;

export default MenuItemModel;
