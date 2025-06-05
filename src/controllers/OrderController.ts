import { Request, Response } from "express";
import { ZodError } from "zod";
import orderService from "../services/OrderService";
import cartService from "../services/CartService";
import { OrderStatus, OrderUpdateDTO } from "../models/Order";
import paymentService from "../services/PaymentService";
import { Payment, PaymentMethod, PaymentStatus } from "../models/Payment";

class OrderController {
  public static _instance: OrderController;

  public static getInstance() {
    if (!OrderController._instance) {
      OrderController._instance = new OrderController();
    }
    return OrderController._instance;
  }

  public async createOrder(req: Request, res: Response): Promise<any> {
    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const userId = req.user._id.toString();
    const user = req.user;

    const userCarts = await cartService.getCartByUserId(user);
    if (!userCarts) {
      return res.status(404).json({ message: "No carts found" });
    }

    // Convert to array if single cart
    const carts = Array.isArray(userCarts) ? userCarts : [userCarts];

    // Check if any cart has items
    const hasItems = carts.some((cart) => cart.items.length > 0);
    if (!hasItems) {
      return res.status(400).json({ message: "All carts are empty" });
    }

    try {
      const order = await orderService.createOrder(carts, userId);

      const itemsByRestaurant = order.items.reduce((acc, item) => {
        const restaurantId = item.restaurantId;
        if (!acc[restaurantId]) {
          acc[restaurantId] = {
            items: [],
            totalAmount: 0,
          };
        }
        acc[restaurantId].items.push(item);
        acc[restaurantId].totalAmount += item.itemTotalPrice;
        return acc;
      }, {} as Record<string, { items: typeof order.items; totalAmount: number }>);

      // Create payments for each restaurant
      const payments = await Promise.all(
        Object.entries(itemsByRestaurant).map(
          async ([restaurantId, { items, totalAmount }]) => {
            return paymentService.createPayment({
              orderId: order._id.toString(),
              amount: totalAmount,
              status: PaymentStatus.PENDING,
              menuItemIds: items.map((item) => item.menuItem._id.toString()),
              restaurantId,
              paymentMethod: PaymentMethod.CREDIT_CARD,
            });
          }
        )
      );

      return res.status(201).json({ order, payments });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to create order" });
    }
  }

  public async getOrder(req: Request, res: Response): Promise<any> {
    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    const userId = req.user._id.toString();

    const order = await orderService.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json(order);
  }

  public async getOrdersByUserId(req: Request, res: Response): Promise<any> {
    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const userId = req.user._id.toString();

    const orders = await orderService.getOrdersByUserId(userId);
    const payments = await paymentService.getPaymentsByOrderIds(
      orders.map((order) => order._id.toString())
    );
    return res.status(200).json({ orders, payments });
  }

  public async updateOrderStatus(req: Request, res: Response): Promise<any> {
    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    const userId = req.user._id.toString();

    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await orderService.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order" });
    }

    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    let payments: Payment[] = [];

    // Update payment status based on order status
    if (updatedOrder) {
      const currentPayments = await paymentService.getPaymentsByOrderIds([
        orderId,
      ]);

      if (updatedOrder.status === OrderStatus.CANCELLED) {
        const updatedPayments = await Promise.all(
          currentPayments.map((payment) =>
            paymentService.updatePaymentStatus(
              payment._id.toString(),
              PaymentStatus.CANCELLED
            )
          )
        );
        payments = updatedPayments.filter(
          (payment): payment is Payment => payment !== null
        );
      } else if (updatedOrder.status === OrderStatus.COMPLETED) {
        const updatedPayments = await Promise.all(
          currentPayments.map((payment) =>
            paymentService.updatePaymentStatus(
              payment._id.toString(),
              PaymentStatus.COMPLETED
            )
          )
        );
        payments = updatedPayments.filter(
          (payment): payment is Payment => payment !== null
        );
      }
    }

    return res.status(200).json({ order: updatedOrder, payments });
  }

  public async cancelOrder(req: Request, res: Response): Promise<any> {
    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    const userId = req.user._id.toString();

    const order = await orderService.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });
    }

    try {
      const cancelledOrder = await orderService.cancelOrder(orderId);
      return res.status(200).json(cancelledOrder);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to cancel order" });
    }
  }
}

const orderController = OrderController.getInstance();

export default orderController;
