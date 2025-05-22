import { Router } from "express";
import userController from "../controllers/UserController";

const userRouter = Router();

userRouter.get("/:id", userController.getUserDetails);
userRouter.put("/:id", userController.updateUserDetails);
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
