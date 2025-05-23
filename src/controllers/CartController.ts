import { Request, Response } from "express";
import cartService from "../services/CartService";
import { ZodError } from "zod";
import { CartCreateSchema } from "../validators/CartValidator";
import {
  CartCreateDTO,
  CartItemAddDTO,
  CartItemUpdateDTO,
} from "../models/Cart";
import {
  CartItemAddSchema,
  CartItemUpdateSchema,
} from "../validators/CartItemValidator";
import menuItemsService from "../services/MenuItemsService";
import { Role } from "../models/User";

class CartController {
  public static _instance: CartController;

  public static getInstance() {
    if (!CartController._instance) {
      CartController._instance = new CartController();
    }
    return CartController._instance;
  }

  public async getCartByUserId(req: Request, res: Response): Promise<any> {
    const userId = req.user._id;

    const cart = await cartService.getCartByUserId(userId as unknown as string);
    return res.status(200).json(cart);
  }

  public async addItemToCart(req: Request, res: Response): Promise<any> {
    const { _id: userId, role } = req.user;
    
    if (role === Role.MEMBER) {
      return res
        .status(403)
        .json({ message: "Not authorized to add item to cart" });
    }

    let data: CartItemAddDTO = req.body;
    try {
      data = CartItemAddSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: error.errors.map((e) => e.message).join(", ") });
      }
    }

    const menuItem = await menuItemsService.getMenuItemById(
      data.menuItem._id.toString()
    );
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    let cart = await cartService.getCartByUserId(userId as unknown as string);
    if (!cart) {
      cart = await cartService.createCart(
        { items: [], totalPrice: 0 },
        userId as unknown as string
      );
    }

    const updatedCart = await cartService.addItemToCart(
      cart._id as unknown as string,
      data
    );
    return res.status(200).json(updatedCart);
  }

  public async updateCartItem(req: Request, res: Response): Promise<any> {
    const userId = req.user._id;
    let data: CartItemUpdateDTO = req.body;
    try {
      data = CartItemUpdateSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: error.errors.map((e) => e.message).join(", ") });
      }
    }

    let cart = await cartService.getCartByUserId(userId as unknown as string);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const updatedCart = await cartService.updateCartItem(cart._id, data);
    return res.status(200).json(updatedCart);
  }

  public async removeItemFromCart(req: Request, res: Response): Promise<any> {
    const userId = req.user._id;
    const { menuItemId } = req.params;

    if (!menuItemId) {
      return res.status(400).json({ message: "Menu item ID is required" });
    }

    let cart = await cartService.getCartByUserId(userId as unknown as string);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const updatedCart = await cartService.removeItemFromCart(
      cart._id as unknown as string,
      menuItemId
    );
    return res.status(200).json({ cart: updatedCart });
  }

  public async clearCart(req: Request, res: Response): Promise<any> {
    const userId = req.user._id;
    const cart = await cartService.clearCart(userId as unknown as string);
    return res.status(200).json({ cart });
  }
}

const cartController = CartController.getInstance();

export default cartController;
