import { z } from "zod";

export const taskIdSchema = z.string().trim().min(1);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().optional(),
  priority: z.string().trim().min(1),
  status: z.string().trim().min(1),
  assignedTo: z.string().trim().nullable().optional(),
  dueDate: z.string().trim().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().optional(),
  priority: z.string().trim().min(1),
  status: z.string().trim().min(1),
  assignedTo: z.string().trim().nullable().optional(),
  dueDate: z.string().trim().optional(),
});
