import { Router } from "express";
import userController from "../controllers/UserController";

const userRouter = Router();

userRouter
  .route("/:id")
  .get(userController.getUserDetails)
  .put(userController.updateUserDetails)
  .delete(userController.deleteUser);

export default userRouter;
