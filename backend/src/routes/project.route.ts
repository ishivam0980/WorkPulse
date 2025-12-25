import { Router } from "express";
import {
  createProjectController,
  deleteProjectController,
  getAllProjectsController,
  getProjectAnalyticsController,
  getProjectByIdController,
  updateProjectController,
} from "../controllers/project.controller";

const projectRoutes = Router();

projectRoutes.post("/workspace/:workspaceId/create", createProjectController);

projectRoutes.get("/workspace/:workspaceId/all", getAllProjectsController);

projectRoutes.get("/:id/workspace/:workspaceId", getProjectByIdController);

projectRoutes.get(
  "/:id/workspace/:workspaceId/analytics",
  getProjectAnalyticsController
);

projectRoutes.put(
  "/:id/workspace/:workspaceId/update",
  updateProjectController
);

projectRoutes.delete(
  "/:id/workspace/:workspaceId/delete",
  deleteProjectController
);

export default projectRoutes;
