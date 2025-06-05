import { UserUpdateDTO } from "../models/User";
import { Request, Response } from "express";
import userService from "../services/UserService";
import cartService from "../services/CartService";

class UserController {
  public static _instance: UserController;

  public static getInstance(): UserController {
    if (!this._instance) {
      this._instance = new UserController();
    }
    return this._instance;
  }

  public async getUserDetails(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }
    const user = await userService.findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const cart = await cartService.getCartByUserId(user);
    return res.status(200).json({ user, cart });
  }

  public async updateUserDetails(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const data: UserUpdateDTO = req.body;
    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }
    const user = await userService.updateUser(id, data);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  }

  public async deleteUser(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id not provided" });
    }
    const deleted = await userService.deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  }
}

const userController = UserController.getInstance();

export default userController;
