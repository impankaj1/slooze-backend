import { z } from "zod";
import { CartItemAddSchema } from "./CartItemValidator";

export const CartCreateSchema = z.object({
  items: z.array(CartItemAddSchema),
  totalPrice: z.number(),
});

export const CartUpdateSchema = CartCreateSchema.partial();
