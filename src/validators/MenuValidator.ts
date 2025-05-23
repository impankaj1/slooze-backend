import z from "zod";

export const MenuItemCreateSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(1),
  description: z.string().min(1),
  restaurantId: z.string().min(1),
});

export const MenuItemUpdateSchema = MenuItemCreateSchema.partial();
