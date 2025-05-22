import { Router } from "express";
import authController from "../controllers/AuthContoller";
import authMiddleware from "../middleware";

const authRouter = Router();

authRouter.get("/me", authMiddleware, authController.fetchMe);

authRouter.post("/signup", authController.signup);

authRouter.post("/login", authController.login);

authRouter.post("/logout", authMiddleware, authController.logout);

authRouter.post("/refresh", authController.refreshToken);

export default authRouter;
