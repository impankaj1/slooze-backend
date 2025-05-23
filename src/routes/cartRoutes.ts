import { Router } from "express";
import cartController from "../controllers/CartController";

const cartRouter = Router();

cartRouter
  .route("/")
  .get(cartController.getCartByUserId)
  .delete(cartController.clearCart);

cartRouter.route("/items").post(cartController.addItemToCart);

cartRouter
  .route("/items/:menuItemId")
  .put(cartController.updateCartItem)
  .delete(cartController.removeItemFromCart);

export default cartRouter;
