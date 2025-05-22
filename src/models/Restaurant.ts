import MenuItemModel, { MenuItem } from "./MenuItems";
import mongoose, { Types } from "mongoose";
import {
  RestaurantCreateSchema,
  FetchRestaurantSchema,
} from "../validators/RestaurantValidator";
import z from "zod";

export interface Restaurant {
  _id: Types.ObjectId;
  name: string;
  description: string;
  menuItemIds: string[];
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    menuItemIds: { type: [String], required: true },
  },
  { timestamps: true }
);

const RestaurantModel = mongoose.model("Restaurant", RestaurantSchema);

export default RestaurantModel;

export type RestaurantCreateDTO = z.infer<typeof RestaurantCreateSchema>;

export type RestaurantUpdateDTO = Partial<RestaurantCreateDTO>;

export type FetchRestaurantDTO = z.infer<typeof FetchRestaurantSchema>;
