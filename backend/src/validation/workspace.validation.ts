import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().optional(),
});

export const workspaceIdSchema = z.string().trim().min(1);

export const changeRoleSchema = z.object({
  roleId: z.string().trim().min(1),
  memberId: z.string().trim().min(1),
});
