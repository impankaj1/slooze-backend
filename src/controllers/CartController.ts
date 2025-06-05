import { Request, Response } from "express";
import cartService from "../services/CartService";
import { ZodError } from "zod";

import { CartItemAddDTO, CartItemUpdateDTO } from "../models/Cart";
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
    const user = req.user;
    const cart = await cartService.getCartByUserId(user);
    if (!cart) {
      return res.status(404).json({ message: "No cart found for this user" });
    }
    return res.status(200).json(cart);
  }

  public async addItemToCart(req: Request, res: Response): Promise<any> {
    const user = req.user;
    let data: CartItemAddDTO = req.body;

    try {
      data = CartItemAddSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: error.errors.map((e) => e.message).join(", ") });
      }
      return res.status(500).json({ message: "Internal server error" });
    }

    const menuItem = await menuItemsService.getMenuItemById(
      data.menuItem._id.toString()
    );
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    let cartResult = await cartService.getCartByUserId(user);

    if (!cartResult || (Array.isArray(cartResult) && !cartResult.length)) {
      cartResult = await cartService.createCart(
        { items: [], totalPrice: 0, country: user.country },
        user
      );
    }

    const cart = Array.isArray(cartResult) ? cartResult[0] : cartResult;

    if (!cart) {
      return res.status(404).json({ message: "No cart available" });
    }

    const updatedCart = await cartService.addItemToCart(
      cart._id.toString(),
      data,
      user
    );

    if (!updatedCart) {
      return res.status(403).json({
        message: "You do not have permission to modify this cart",
      });
    }

    return res.status(200).json(updatedCart);
  }

  public async updateCartItem(req: Request, res: Response): Promise<any> {
    const user = req.user;
    let data: CartItemUpdateDTO = req.body;

    try {
      data = CartItemUpdateSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: error.errors.map((e) => e.message).join(", ") });
      }
      return res.status(500).json({ message: "Internal server error" });
    }

    let cartResult = await cartService.getCartByUserId(user);
    if (!cartResult) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cart = Array.isArray(cartResult) ? cartResult[0] : cartResult;
    if (!cart) {
      return res.status(404).json({ message: "No cart available" });
    }

    const updatedCart = await cartService.updateCartItem(cart._id, data, user);
    if (!updatedCart) {
      return res.status(403).json({
        message: "You do not have permission to modify this cart",
      });
    }

    return res.status(200).json(updatedCart);
  }

  public async removeItemFromCart(req: Request, res: Response): Promise<any> {
    const user = req.user;
    const { menuItemId } = req.params;

    if (!menuItemId) {
      return res.status(400).json({ message: "Menu item ID is required" });
    }

    let cartResult = await cartService.getCartByUserId(user);
    if (!cartResult) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cart = Array.isArray(cartResult) ? cartResult[0] : cartResult;
    if (!cart) {
      return res.status(404).json({ message: "No cart available" });
    }

    const updatedCart = await cartService.removeItemFromCart(
      cart._id.toString(),
      menuItemId,
      user
    );

    if (!updatedCart) {
      return res.status(403).json({
        message:
          "You do not have permission to modify this cart or item not found",
      });
    }

    return res.status(200).json({ cart: updatedCart });
  }

  public async clearCart(req: Request, res: Response): Promise<any> {
    const user = req.user;
    const cart = await cartService.clearCart(user._id.toString(), user);

    if (!cart) {
      return res.status(403).json({
        message:
          "You do not have permission to modify this cart or cart not found",
      });
    }

    return res.status(200).json({ cart });
  }
}

const cartController = CartController.getInstance();

export default cartController;
