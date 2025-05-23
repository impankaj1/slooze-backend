import { Router } from "express";
import orderController from "../controllers/OrderController";
import paymentController from "../controllers/PaymentController";

const orderRouter = Router();

orderRouter
  .route("/")
  .post(orderController.createOrder)
  .get(orderController.getOrdersByUserId);

orderRouter
  .route("/:orderId")
  .put(orderController.updateOrderStatus)
  .delete(orderController.cancelOrder);

orderRouter.route("/user/:userId").get(orderController.getOrdersByUserId);

export default orderRouter;
