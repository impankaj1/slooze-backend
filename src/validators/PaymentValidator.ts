import { z } from "zod";
import { PaymentMethod, PaymentStatus } from "../models/Payment";

export const PaymentCreateSchema = z.object({
  orderId: z.string(),
  amount: z.number(),
  status: z.nativeEnum(PaymentStatus),
  menuItemIds: z.array(z.string()),
  restaurantId: z.string(),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

export const PaymentUpdateSchema = PaymentCreateSchema.partial();

