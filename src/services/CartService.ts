import { Types } from "mongoose";
import {
  Cart,
  CartItem,
  CartItemAddDTO,
  CartItemUpdateDTO,
  CartUpdateDTO,
} from "../models/Cart";
import { CartCreateDTO } from "../models/Cart";
import CartModel from "../models/Cart";
import { MenuItem } from "../models/MenuItems";

class CartService {
  public static _instance: CartService;

  public static getInstance() {
    if (!CartService._instance) {
      CartService._instance = new CartService();
    }
    return CartService._instance;
  }

  public async createCart(cart: CartCreateDTO, userId: string): Promise<Cart> {
    const newCart = await CartModel.create({ ...cart, userId });
    return newCart;
  }

  public async getCart(id: string): Promise<Cart | null> {
    const cart = await CartModel.findById(id);
    return cart;
  }

  public async getCartByUserId(userId: string): Promise<Cart | null> {
    const cart = await CartModel.findOne({ userId });
    return cart;
  }

  public async addItemToCart(
    id: string,
    item: CartItemAddDTO
  ): Promise<Cart | null> {
    const cart = await CartModel.findById(id);
    if (!cart) {
      throw new Error("Cart not found");
    }
    const existingItem = cart.items.find(
      (cartItem) =>
        cartItem.menuItem._id.toString() === item.menuItem._id.toString()
    );
    if (existingItem) {
      existingItem.quantity += item.quantity;
      existingItem.itemTotalPrice += item.itemTotalPrice;
    } else {
      const cartItem: CartItem = {
        menuItem: item.menuItem as unknown as MenuItem,
        quantity: item.quantity,
        restaurantId: item.restaurantId,
        itemTotalPrice: item.itemTotalPrice,
      };
      cart.items.push(cartItem);
    }
    cart.totalPrice += item.itemTotalPrice;
    return cart.save();
  }

  public async updateCart(
    id: string,
    payload: CartUpdateDTO
  ): Promise<Cart | null> {
    const updatedCart = await CartModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return updatedCart;
  }

  public async removeItemFromCart(
    id: string,
    itemId: string
  ): Promise<Cart | null> {
    const cart = await CartModel.findById(id);
    if (!cart) {
      throw new Error("Cart not found");
    }
    const item = cart.items.find(
      (item) => item.menuItem._id.toString() === itemId
    );
    if (!item) {
      throw new Error("Item not found");
    }
    cart.items = cart.items.filter(
      (item) => item.menuItem._id.toString() !== itemId
    );
    cart.totalPrice -= item.itemTotalPrice;
    return cart.save();
  }

  public async updateCartItem(
    cartId: Types.ObjectId,
    payload: CartItemUpdateDTO
  ): Promise<Cart | null> {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.menuItem._id.toString() === payload.menuItem._id.toString()
    );
    if (itemIndex === -1) {
      return null;
    }
    const updatedItem: CartItem = {
      ...cart.items[itemIndex],
      ...payload,
      menuItem: payload.menuItem as unknown as MenuItem,
    };
    cart.items[itemIndex] = updatedItem;
    cart.totalPrice -= cart.items[itemIndex].itemTotalPrice;
    cart.totalPrice += updatedItem.itemTotalPrice;
    return cart.save();
  }

  public async clearCart(userId: string): Promise<Cart | null> {
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      throw new Error("Cart not found");
    }
    cart.items = [];
    cart.totalPrice = 0;
    return cart.save();
  }
}

const cartService = CartService.getInstance();

export default cartService;
