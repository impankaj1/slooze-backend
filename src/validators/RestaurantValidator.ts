import { MenuItemCreateSchema } from "./MenuValidator";
import z from "zod";

export const RestaurantCreateSchema = z.object({
  name: z.string(),
  description: z.string(),
  country: z.string(),
  menu: z.array(MenuItemCreateSchema).optional(),
});

export const RestaurantUpdateSchema = RestaurantCreateSchema.partial();
