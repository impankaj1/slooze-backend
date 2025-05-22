import { Order, OrderStatus } from "./../models/Order";
import { OrderCreateDTO, OrderUpdateDTO } from "../models/Order";

import OrderModel from "../models/Order";

class OrderService {
  public static _instance: OrderService;

  public static getInstance() {
    if (!OrderService._instance) {
      OrderService._instance = new OrderService();
    }
    return OrderService._instance;
  }

  public async createOrder(payload: OrderCreateDTO) {
    const order = await OrderModel.create(payload);
    return order.toObject();
  }

  public async getOrders(): Promise<Order[]> {
    const orders = await OrderModel.find();
    return orders.map((order) => order.toObject());
  }

  public async getOrderById(id: string): Promise<Order | null> {
    const order = await OrderModel.findById(id);
    return order ? order.toObject() : null;
  }

  public async getOrdersByUserId(userId: string): Promise<Order[]> {
    const orders = await OrderModel.find({ userId });
    return orders.map((order) => order.toObject());
  }

  public async updateOrder(
    order: Order,
    payload: OrderUpdateDTO
  ): Promise<Order | null> {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      order._id,
      payload,
      {
        new: true,
      }
    );
    return updatedOrder ? updatedOrder.toObject() : null;
  }

  public async deleteOrder(id: string): Promise<boolean> {
    const deletedOrder = await OrderModel.findByIdAndDelete(id);
    return deletedOrder !== null;
  }

  public async getOrderStatus(id: string): Promise<string | null> {
    const order = await OrderModel.findById(id);
    return order?.status ?? null;
  }

  public async updateOrderStatus(
    id: string,
    status: string
  ): Promise<Order | null> {
    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      }
    );
    return order ? order.toObject() : null;
  }

  public async cancelOrder(id: string): Promise<Order | null> {
    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status: OrderStatus.CANCELLED },
      { new: true }
    );
    return order ? order.toObject() : null;
  }
}

const orderService = OrderService.getInstance();

export default orderService;
