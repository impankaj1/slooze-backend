import paymentService from "../services/PaymentService";
import { Request, Response } from "express";
class PaymentController {
  public static _instance: PaymentController;

  public static getInstance() {
    if (!PaymentController._instance) {
      PaymentController._instance = new PaymentController();
    }
    return PaymentController._instance;
  }

  public async createPayment(req: Request, res: Response): Promise<any> {
    const payment = await paymentService.createPayment(req.body);
    return res.status(200).json(payment);
  }

  public async getPaymentById(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Payment ID is required" });
    }
    const payment = await paymentService.getPaymentById(id);
    return res.status(200).json(payment);
  }

  public async getPaymentsByOrderId(req: Request, res: Response): Promise<any> {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    const payments = await paymentService.getPaymentsByOrderId(orderId);
    return res.status(200).json(payments);
  }

  public async updatePayment(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Payment ID is required" });
    }
    const payment = await paymentService.getPaymentById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    const updatedPayment = await paymentService.updatePayment(id, req.body);
    return res.status(200).json(updatedPayment);
  }

  public async deletePayment(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Payment ID is required" });
    }
    const deletedPayment = await paymentService.deletePayment(id);
    return res.status(200).json(deletedPayment);
  }

  public async getPaymentStatus(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Payment ID is required" });
    }
    const paymentStatus = await paymentService.getPaymentStatus(id);
    return res.status(200).json(paymentStatus);
  }

  public async updatePaymentStatus(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Payment ID is required" });
    }
    const updatedPayment = await paymentService.updatePaymentStatus(
      id,
      req.body
    );
    return res.status(200).json(updatedPayment);
  }
}

const paymentController = PaymentController.getInstance();

export default paymentController;
