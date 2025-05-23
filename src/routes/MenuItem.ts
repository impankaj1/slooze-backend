import { Router } from "express";
import menuItemsController from "../controllers/MenuItemsController";
import authMiddleware from "../middleware";

const menuItemRouter = Router();

menuItemRouter.route("/").get(menuItemsController.getMenuItems);

menuItemRouter
  .route("/:id")
  .get(menuItemsController.getMenuItemsById)
  .put(authMiddleware, menuItemsController.updateMenuItems)
  .delete(authMiddleware, menuItemsController.deleteMenuItems);

menuItemRouter
  .route("/restaurant/:restaurantId")
  .get(menuItemsController.getMenuItemsByRestaurantId)
  .post(authMiddleware, menuItemsController.createMenuItems);

export default menuItemRouter;
