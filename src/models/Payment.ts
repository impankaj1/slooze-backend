import mongoose, { Types } from "mongoose";
import { PaymentUpdateSchema } from "../validators/PaymentValidator";
import { PaymentCreateSchema } from "../validators/PaymentValidator";
import z from "zod";

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  FAILED = "failed",
}

export interface Payment {
  _id: Types.ObjectId;
  menuItemIds: string[];
  restaurantId: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  PAYPAL = "paypal",
  CASH = "cash",
  UPI = "upi",
}

const PaymentSchema = new mongoose.Schema(
  {
    menuItemIds: { type: [String], required: true },
    restaurantId: { type: String, required: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: PaymentStatus, required: true },
    paymentMethod: { type: String, enum: PaymentMethod, required: true },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model("Payment", PaymentSchema);

export default PaymentModel;

export type PaymentCreateDTO = z.infer<typeof PaymentCreateSchema>;
export type PaymentUpdateDTO = z.infer<typeof PaymentUpdateSchema>;
