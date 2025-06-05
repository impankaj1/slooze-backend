import { Order, OrderCreateDTO, OrderStatus } from "../models/Order";
import OrderModel from "../models/Order";
import { Cart, CartItem } from "../models/Cart";
import CartModel from "../models/Cart";

class OrderService {
  public static _instance: OrderService;

  public static getInstance() {
    if (!OrderService._instance) {
      OrderService._instance = new OrderService();
    }
    return OrderService._instance;
  }

  public async createOrder(
    carts: Cart | Cart[],
    userId: string
  ): Promise<Order> {

    const cartArray = Array.isArray(carts) ? carts : [carts];

    const allItems = cartArray.reduce((acc, cart) => {
      return [...acc, ...cart.items];
    }, [] as CartItem[]);

    const totalPrice = cartArray.reduce((acc, cart) => {
      return acc + cart.totalPrice;
    }, 0);

    const orderData: OrderCreateDTO = {
      items: allItems,
      totalPrice,
      status: OrderStatus.PENDING,
    };

    const order = await OrderModel.create({
      ...orderData,
      userId,
    });

    await Promise.all(
      cartArray.map((cart) => CartModel.findByIdAndDelete(cart._id))
    );

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
