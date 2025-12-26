import { Router } from "express";
import { getCurrentUserController, updateCurrentUserController } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/current", getCurrentUserController);
userRoutes.put("/current", updateCurrentUserController);

export default userRoutes;
