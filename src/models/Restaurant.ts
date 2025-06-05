import MenuItemModel, { MenuItem } from "./MenuItems";
import mongoose, { Types } from "mongoose";
import { RestaurantCreateSchema } from "../validators/RestaurantValidator";
import z from "zod";

export interface Restaurant {
  _id: Types.ObjectId;
  name: string;
  description: string;
  menuItemIds: string[];
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    country: { type: String, required: true },
    menuItemIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

const RestaurantModel = mongoose.model("Restaurant", RestaurantSchema);

export default RestaurantModel;

export type RestaurantCreateDTO = z.infer<typeof RestaurantCreateSchema>;

export type RestaurantUpdateDTO = Partial<RestaurantCreateDTO>;
