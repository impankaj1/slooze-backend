import { Router } from "express";
import paymentController from "../controllers/PaymentController";
import authMiddleware from "../middleware";

const paymentRouter = Router();

paymentRouter
  .route("/:paymentId")
  .put(authMiddleware, paymentController.updatePayment);

export default paymentRouter;
