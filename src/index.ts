import express from "express";
import "dotenv/config";
import "./db/index";
import cors from "cors";
import { User } from "./models/User";
import cookieParser from "cookie-parser";
import authRouter from "./routes/AuthRoutes";
import userRouter from "./routes/UserRoutes";
import restaurantRouter from "./routes/RestaurantRoutes";
import authMiddleware from "./middleware";
import menuItemRouter from "./routes/MenuItem";
import orderRouter from "./routes/OrderRoutes";
import cartRouter from "./routes/cartRoutes";
import paymentRouter from "./routes/PaymentRoutes";
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

app.use("/auth", authRouter);
app.use("/restaurants", restaurantRouter);
app.use("/users", authMiddleware, userRouter);
app.use("/menu-items", menuItemRouter);
app.use("/orders", authMiddleware, orderRouter);
app.use("/cart", authMiddleware, cartRouter);
app.use("/payments", paymentRouter);

app.get("/", (req, res) => {
  res.send("Hello World ");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
