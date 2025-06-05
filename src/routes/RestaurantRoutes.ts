import { Router } from "express";
import RestaurantController from "../controllers/RestaurantController";
import authMiddleware from "../middleware";

const restaurantRouter = Router();

restaurantRouter.get("/", authMiddleware, RestaurantController.getRestaurants);

restaurantRouter.get("/:id", RestaurantController.getRestaurantById);

restaurantRouter.post(
  "/",
  authMiddleware,
  RestaurantController.createRestaurant
);

restaurantRouter.put("/:id", RestaurantController.updateRestaurant);

restaurantRouter.delete("/:id", RestaurantController.deleteRestaurant);

export default restaurantRouter;
