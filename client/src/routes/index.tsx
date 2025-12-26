import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protected.route";
import AppLayout from "@/layout/app.layout";
import AuthPage from "@/page/auth/auth.page";
import GoogleOAuthFailure from "@/page/auth/google-oauth-failure.page";
import DashboardPage from "@/page/dashboard/dashboard.page";
import TasksPage from "@/page/tasks/tasks.page";
import MembersPage from "@/page/members/members.page";
import SettingsPage from "@/page/settings/settings.page";
import ProjectDetailsPage from "@/page/project/project-details.page";
import InviteUserPage from "@/page/invite/invite.page";
import NotFoundPage from "@/page/errors/not-found.page";
import UnauthorizedPage from "@/page/errors/unauthorized.page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
  {
    path: "/google/callback",
    element: <GoogleOAuthFailure />,
  },
  {
    path: "/invite/workspace/:inviteCode/join",
    element: <InviteUserPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/workspace/:workspaceId",
            element: <DashboardPage />,
          },
          {
            path: "/workspace/:workspaceId/tasks",
            element: <TasksPage />,
          },
          {
            path: "/workspace/:workspaceId/members",
            element: <MembersPage />,
          },
          {
            path: "/workspace/:workspaceId/settings",
            element: <SettingsPage />,
          },
          {
            path: "/workspace/:workspaceId/project/:projectId",
            element: <ProjectDetailsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
