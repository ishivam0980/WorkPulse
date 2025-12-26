const authRoutePaths = {
  signIn: "/",
  googleOAuthCallback: "/google/callback",
} as const;

const protectedRoutePaths = {
  dashboard: "/workspace/:workspaceId",
  tasks: "/workspace/:workspaceId/tasks",
  members: "/workspace/:workspaceId/members",
  settings: "/workspace/:workspaceId/settings",
  project: "/workspace/:workspaceId/project/:projectId",
} as const;

const baseRoutes = [
  authRoutePaths.signIn,
  authRoutePaths.googleOAuthCallback,
];

const isAuthRoute = (pathname: string) => {
  return baseRoutes.some((route) => pathname === route);
};

export { authRoutePaths, protectedRoutePaths, isAuthRoute };
