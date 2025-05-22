import { Router } from "express";
import menuItemsController from "../controllers/MenuItemsController";

const menuItemRouter = Router();

menuItemRouter.post("/", menuItemsController.createMenuItems);
menuItemRouter.get("/", menuItemsController.getMenuItems);
menuItemRouter.get("/:id", menuItemsController.getMenuItemsById);
menuItemRouter.put("/:id", menuItemsController.updateMenuItems);
menuItemRouter.delete("/:id", menuItemsController.deleteMenuItems);

export default menuItemRouter;
