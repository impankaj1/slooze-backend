import OrderModel, {
  Order,
  OrderCreateDTO,
  OrderStatus,
} from "../models/Order";
import { Cart } from "../models/Cart";

class OrderService {
  public static _instance: OrderService;

  public static getInstance() {
    if (!OrderService._instance) {
      OrderService._instance = new OrderService();
    }
    return OrderService._instance;
  }

  public async createOrder(cart: Cart, userId: string): Promise<Order> {
    const orderData: OrderCreateDTO = {
      items: cart.items,
      totalPrice: cart.totalPrice,
      status: OrderStatus.PENDING,
    };

    const order = await OrderModel.create({
      ...orderData,
      userId,
    });

    return order;
  }

  public async getOrder(id: string): Promise<Order | null> {
    const order = await OrderModel.findById(id);
    return order;
  }

  public async getOrdersByUserId(userId: string): Promise<Order[]> {
    const orders = await OrderModel.find({ userId });
    return orders;
  }

  public async updateOrderStatus(
    id: string,
    status: OrderStatus
  ): Promise<Order | null> {
    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return order;
  }

  public async cancelOrder(id: string): Promise<Order | null> {
    const order = await OrderModel.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.COMPLETED) {
      throw new Error("Cannot cancel a completed order");
    }

    order.status = OrderStatus.CANCELLED;
    return order.save();
  }
}

const orderService = OrderService.getInstance();

export default orderService;
