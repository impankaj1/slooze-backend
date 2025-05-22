import { Router } from "express";
import RestaurantController from "../controllers/RestaurantController";

const restaurantRouter = Router();

restaurantRouter.post("/", RestaurantController.getRestaurants);

restaurantRouter.get("/:id", RestaurantController.getRestaurantById);

restaurantRouter.post("/", RestaurantController.createRestaurant);

restaurantRouter.put("/:id", RestaurantController.updateRestaurant);

restaurantRouter.delete("/:id", RestaurantController.deleteRestaurant);

export default restaurantRouter;
