import { Payment, PaymentCreateDTO, PaymentUpdateDTO } from "../models/Payment";

import PaymentModel from "../models/Payment";

class PaymentService {
  public static _instance: PaymentService;

  public static getInstance() {
    if (!PaymentService._instance) {
      PaymentService._instance = new PaymentService();
    }
    return PaymentService._instance;
  }

  public async createPayment(payment: PaymentCreateDTO): Promise<Payment> {
    const newPayment = await PaymentModel.create(payment);
    return newPayment.toObject();
  }

  public async getPaymentById(id: string): Promise<Payment | null> {
    const payment = await PaymentModel.findById(id);
    return payment ? payment.toObject() : null;
  }

  public async getPaymentsByOrderId(orderId: string): Promise<Payment[]> {
    const payments = await PaymentModel.find({ orderId });
    return payments.map((payment) => payment.toObject());
  }

  public async getPaymentsByOrderIds(orderIds: string[]): Promise<Payment[]> {
    const payments = await PaymentModel.find({ orderId: { $in: orderIds } });
    return payments.map((payment) => payment.toObject());
  }

  public async updatePayment(
    id: string,
    payment: PaymentUpdateDTO
  ): Promise<Payment | null> {
    const updatedPayment = await PaymentModel.findByIdAndUpdate(id, payment, {
      new: true,
    });
    return updatedPayment ? updatedPayment.toObject() : null;
  }

  public async deletePayment(id: string): Promise<boolean> {
    const deletedPayment = await PaymentModel.findByIdAndDelete(id);
    return deletedPayment !== null;
  }

  public async getPaymentStatus(id: string): Promise<string | null> {
    const payment = await PaymentModel.findById(id);
    return payment?.status ?? null;
  }

  public async updatePaymentStatus(
    paymentId: string,
    status: string
  ): Promise<Payment | null> {
    const payment = await PaymentModel.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    );
    return payment ? payment.toObject() : null;
  }
}

const paymentService = PaymentService.getInstance();

export default paymentService;
