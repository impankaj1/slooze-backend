import { Router } from "express";
import orderController from "../controllers/OrderController";

const orderRouter = Router();

orderRouter.post("/", orderController.createOrder);
orderRouter.get("/", orderController.getOrders);
orderRouter.get("/:id", orderController.getOrderById);
orderRouter.get("/user/:userId", orderController.getOrdersByUserId);
orderRouter.put("/:id", orderController.updateOrder);
orderRouter.delete("/:id", orderController.deleteOrder);

export default orderRouter;