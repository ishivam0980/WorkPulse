import { z } from "zod";

export const projectIdSchema = z.string().trim().min(1);

export const createProjectSchema = z.object({
  emoji: z.string().trim().optional(),
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().optional(),
});

export const updateProjectSchema = z.object({
  emoji: z.string().trim().optional(),
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().optional(),
});
