import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";

import "./config/passport.config";
import passport from "passport";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(HTTPSTATUS.OK).json({
      message: "WorkPulse API is running 🚀",
    });
  })
);

// Routes will be added here in later phases
// app.use(`${BASE_PATH}/auth`, authRoutes);
// app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
// app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
// app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
// app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
// app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`🚀 WorkPulse server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
  await connectDatabase();
});
