import { ZodError } from "zod";
import { RestaurantCreateDTO, RestaurantUpdateDTO } from "../models/Restaurant";
import { RestaurantCreateSchema } from "../validators/RestaurantValidator";
import { Request, Response } from "express";
import restaurantService from "../services/RestaurantService";
import MenuItemsService from "../services/MenuItemsService";
import { Role } from "../models/User";

class RestaurantController {
  private static _instance: RestaurantController;

  public static getInstance() {
    if (!this._instance) {
      this._instance = new RestaurantController();
    }
    return this._instance;
  }

  public async getRestaurants(req: Request, res: Response): Promise<any> {
    const user = req.user;
    const restaurants = await restaurantService.fetchRestaurants(user);
    return res.status(200).json(restaurants);
  }

  public async getRestaurantById(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }
    const restaurant = await restaurantService.getRestaurantById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const menuItems = await MenuItemsService.getMenuItemsByRestaurantId(id);
    return res.status(200).json({ restaurant, menuItems });
  }

  public async createRestaurant(req: Request, res: Response): Promise<any> {
    let data: RestaurantCreateDTO = req.body;

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (user.role !== Role.ADMIN) {
      return res
        .status(403)
        .json({ message: "Not authorized to create restaurant" });
    }

    try {
      data = RestaurantCreateSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(403)
          .json({ message: error.errors.map((e) => e.message).join(", ") });
      }
      return res.status(500).json({ message: "Internal server error" });
    }

    const restaurant = await restaurantService.createRestaurant(data);
    return res.status(200).json(restaurant);
  }

  public async updateRestaurant(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const data: RestaurantUpdateDTO = req.body;
    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (user.role !== Role.ADMIN) {
      return res
        .status(403)
        .json({ message: "Not authorized to update restaurant" });
    }

    const restaurant = await restaurantService.getRestaurantById(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const updatedRestaurant = await restaurantService.updateRestaurant(
      restaurant,
      data
    );

    return res.status(200).json(updatedRestaurant);
  }

  public async deleteRestaurant(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const restaurant = await restaurantService.getRestaurantById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const deleted = await restaurantService.deleteRestaurant(id);

    if (!deleted) {
      return res.status(404).json({
        message:
          "Error occurred while deleting restaurant, please try again later",
      });
    }
    return res.status(200).json({ message: "Restaurant deleted successfully" });
  }
}

const restaurantController = RestaurantController.getInstance();

export default restaurantController;
