import { z } from "zod";
import { MenuItemCreateSchema } from "./MenuValidator";
import { OrderStatus } from "../models/Order";

export const OrderCreateSchema = z.object({
  restaurantId: z.string(),
  userId: z.string(),
  items: z.array(MenuItemCreateSchema),
  totalPrice: z.number(),
  status: z.nativeEnum(OrderStatus),
});

export const OrderUpdateSchema = OrderCreateSchema.partial();
