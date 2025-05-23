import MenuItemModel, { MenuItem } from "../models/MenuItems";
import { MenuItemCreateDTO, MenuItemUpdateDTO } from "../models/MenuItems";

class MenuItemsService {
  private static _instance: MenuItemsService;

  public static getInstance() {
    if (!this._instance) {
      this._instance = new MenuItemsService();
    }
    return this._instance;
  }

  public async createMenuItems(payload: MenuItemCreateDTO): Promise<MenuItem> {
    const menuItems = await MenuItemModel.create(payload);
    return menuItems.toObject();
  }

  public async getMenuItemsByRestaurantId(
    restaurantId: string
  ): Promise<MenuItem[]> {
    const menuItems = await MenuItemModel.find({ restaurantId });
    return menuItems.map((menuItem) => menuItem.toObject());
  }

  public async getMenuItems(): Promise<MenuItem[]> {
    const menuItems = await MenuItemModel.find();
    return menuItems.map((menuItem) => menuItem.toObject());
  }

  public async getMenuItemById(id: string): Promise<MenuItem | null> {
    const menuItem = await MenuItemModel.findById(id);
    return menuItem ? menuItem.toObject() : null;
  }

  public async updateMenuItems(
    menuItem: MenuItem,
    payload: MenuItemUpdateDTO
  ): Promise<MenuItem | null> {
    const updatedMenuItem = await MenuItemModel.findByIdAndUpdate(
      menuItem._id,
      payload
    );
    return updatedMenuItem ? updatedMenuItem.toObject() : null;
  }

  public async deleteMenuItems(id: string) {
    const menuItems = await MenuItemModel.findByIdAndDelete(id);
    return menuItems !== null;
  }
}

const menuItemsService = MenuItemsService.getInstance();

export default menuItemsService;
