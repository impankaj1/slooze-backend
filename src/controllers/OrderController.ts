import { ZodError } from "zod";
import { OrderCreateDTO, OrderUpdateDTO } from "../models/Order";
import {
  OrderCreateSchema,
  OrderUpdateSchema,
} from "../validators/OrderValidator";
import orderService from "../services/OrderService";
import { Request, Response } from "express";
import paymentService from "../services/PaymentService";
import { PaymentMethod, PaymentStatus } from "../models/Payment";

class OrderController {
  public static _instance: OrderController;

  public static getInstance() {
    if (!OrderController._instance) {
      OrderController._instance = new OrderController();
    }
    return OrderController._instance;
  }

  public async createOrder(req: Request, res: Response): Promise<any> {
    let data: OrderCreateDTO = req.body;
    try {
      data = OrderCreateSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: error.errors.map((e) => e.message).join(", ") });
      }
      return res.status(500).json({ message: "Internal server error" });
    }

    const order = await orderService.createOrder(data);

    const payment = await paymentService.createPayment({
      orderId: order._id as unknown as string,
      amount: order.totalPrice,
      status: PaymentStatus.PENDING,
      menuItemIds: order.menuItemIds,
      restaurantId: order.restaurantId,
      paymentMethod: PaymentMethod.CREDIT_CARD,
    });
    return res.status(200).json({ order, payment });
  }

  public async getOrders(req: Request, res: Response): Promise<any> {
    const orders = await orderService.getOrders();
    return res.status(200).json(orders);
  }

  public async getOrderById(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    const order = await orderService.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const payment = await paymentService.getPaymentById(order.paymentId);
    return res.status(200).json({ order, payment });
  }

  public async getOrdersByUserId(req: Request, res: Response): Promise<any> {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const orders = await orderService.getOrdersByUserId(userId);
    if (!orders) {
      return res.status(404).json({ message: "Orders not found" });
    }
    return res.status(200).json(orders);
  }

  public async updateOrder(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    let data: OrderUpdateDTO = req.body;
    try {
      data = OrderUpdateSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: error.errors.map((e) => e.message).join(", ") });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
    const order = await orderService.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const updatedOrder = await orderService.updateOrder(order, data);
    return res.status(200).json(updatedOrder);
  }

  public async deleteOrder(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    const order = await orderService.deleteOrder(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order deleted successfully" });
  }

  public async cancelOrder(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    const order = await orderService.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const payment = await paymentService.updatePaymentStatus(
      order.paymentId,
      PaymentStatus.CANCELLED
    );
    if (!payment) {
      return res
        .status(404)
        .json({ message: "Payment could not be cancelled" });
    }

    const cancelledOrder = await orderService.cancelOrder(id);
    if (!cancelledOrder) {
      return res.status(404).json({ message: "Order could not be cancelled" });
    }

    return res.status(200).json({ message: "Order cancelled successfully" });
  }
}
const orderController = OrderController.getInstance();
export default orderController;
