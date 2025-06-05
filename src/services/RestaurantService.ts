import RestaurantModel, {
  Restaurant,
  RestaurantCreateDTO,
  RestaurantUpdateDTO,
} from "../models/Restaurant";
import { Role, User } from "../models/User";

class RestaurantService {
  private static _instance: RestaurantService;

  public static getInstance() {
    if (!this._instance) {
      this._instance = new RestaurantService();
    }
    return this._instance;
  }

  public async fetchRestaurants(user: User): Promise<Restaurant[]> {
    let restaurants;
    
    if (user.role === Role.ADMIN) {
      restaurants = await RestaurantModel.find();
    } else {
      restaurants = await RestaurantModel.find({ country: user.country });
    }

    return restaurants.map((restaurant) => restaurant.toObject());
  }

  public async getRestaurantById(id: string): Promise<Restaurant | null> {
    const restaurant = await RestaurantModel.findById(id);
    return restaurant ? restaurant.toObject() : null;
  }

  public async createRestaurant(
    restaurant: RestaurantCreateDTO
  ): Promise<Restaurant> {
    const newRestaurant = await RestaurantModel.create(restaurant);
    return newRestaurant.toObject();
  }

  public async updateRestaurant(
    restaurant: Restaurant,
    payload: RestaurantUpdateDTO
  ): Promise<Restaurant | null> {
    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      restaurant._id,
      payload
    );
    return updatedRestaurant ? updatedRestaurant.toObject() : null;
  }

  public async deleteRestaurant(id: string): Promise<boolean> {
    const deletedRestaurant = await RestaurantModel.findByIdAndDelete(id);
    return deletedRestaurant !== null;
  }
}

const restaurantService = RestaurantService.getInstance();

export default restaurantService;
