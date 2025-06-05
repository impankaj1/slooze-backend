import { z } from "zod";
import { CartItemAddSchema } from "./CartItemValidator";

export const CartCreateSchema = z.object({
  items: z.array(CartItemAddSchema),
  totalPrice: z.number(),
  country: z.string().min(1, "country is required"),
});

export const CartUpdateSchema = CartCreateSchema.partial();
