import { MenuItemCreateSchema } from "./MenuValidator";
import z from "zod";

export const RestaurantCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  menu: z.array(MenuItemCreateSchema),
});

export const FetchRestaurantSchema = z.object({
  name: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
});

export const RestaurantUpdateSchema = RestaurantCreateSchema.partial();
