import MenuItemsService from "../services/MenuItemsService";
import { Request, Response } from "express";
import {
  MenuItemCreateSchema,
  MenuItemUpdateSchema,
} from "../validators/MenuValidator";
import { ZodError } from "zod";
import { MenuItemCreateDTO, MenuItemUpdateDTO } from "../models/MenuItems";

class MenuItemsController {
  private static _instance: MenuItemsController;

  public static getInstance() {
    if (!this._instance) {
      this._instance = new MenuItemsController();
    }
    return this._instance;
  }

  public async createMenuItems(req: Request, res: Response): Promise<any> {
    let data: MenuItemCreateDTO = req.body;

    try {
      data = MenuItemCreateSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(403)
          .json({ message: error.errors.map((e) => e.message).join(", ") });
      }
      return res.status(500).json({ message: "Internal server error" });
    }

    const menuItems = await MenuItemsService.createMenuItems(data);
    return res.status(200).json(menuItems);
  }

  public async getMenuItems(req: Request, res: Response): Promise<any> {
    const menuItems = await MenuItemsService.getMenuItems();
    return res.status(200).json(menuItems);
  }

  public async getMenuItemsById(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Menu item ID is required" });
    }
    const menuItem = await MenuItemsService.getMenuItemsById(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    return res.status(200).json(menuItem);
  }

  public async updateMenuItems(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    let data: MenuItemUpdateDTO = req.body;
    if (!id) {
      return res.status(400).json({ message: "Menu item ID is required" });
    }
    try {
      data = MenuItemUpdateSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(403)
          .json({ message: error.errors.map((e) => e.message).join(", ") });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
    const menuItem = await MenuItemsService.getMenuItemsById(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    const updatedMenuItem = await MenuItemsService.updateMenuItems(
      menuItem,
      data
    );
    if (!updatedMenuItem) {
      return res.status(403).json({
        message:
          "Error occurred while updating menu item, please try again later",
      });
    }

    return res.status(200).json(updatedMenuItem);
  }

  public async deleteMenuItems(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Menu item ID is required" });
    }

    const menuItem = await MenuItemsService.getMenuItemsById(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    const deleted = await MenuItemsService.deleteMenuItems(id);

    if (!deleted) {
      return res.status(404).json({
        message:
          "Error occurred while deleting menu item, please try again later",
      });
    }
    return res.status(200).json({ message: "Menu item deleted" });
  }
}
const menuItemsController = MenuItemsController.getInstance();

export default menuItemsController;
