import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js"
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRoute.post("/signup", signup);
userRoute.post("/login", login);
userRoute.put("/update-profile", protectRoute, updateProfile);
userRoute.get("/check", protectRoute, checkAuth);

export default userRouter;