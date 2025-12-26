import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useCreateTaskDialog } from "@/hooks/use-task-dialog";
import { useCreateTaskMutation, useEditTaskMutation } from "@/hooks/api/use-task";
import { useGetProjectsQuery } from "@/hooks/api/use-project";
import { useGetWorkspaceMembers } from "@/hooks/api/use-member";
import { TaskStatusOptions, TaskPriorityOptions } from "@/constant";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  projectId: z.string().min(1, "Project is required"),
  status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  assignedTo: z.string().optional(),
  dueDate: z.date().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface CreateTaskDialogProps {
  workspaceId: string;
}

export function CreateTaskDialog({ workspaceId }: CreateTaskDialogProps) {
  const { isOpen, onClose, task } = useCreateTaskDialog();
  const isEditing = !!task;

  const { data: projectsData } = useGetProjectsQuery({
    workspaceId,
    pageSize: 100,
    pageNumber: 1,
  });
  const { data: membersData } = useGetWorkspaceMembers(workspaceId);

  const { mutate: createTask, isPending: isCreating } = useCreateTaskMutation(workspaceId);
  const { mutate: editTask, isPending: isUpdating } = useEditTaskMutation(workspaceId);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: "",
      status: "TODO",
      priority: "MEDIUM",
      assignedTo: undefined,
      dueDate: undefined,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || "",
        projectId: typeof task.project === "object" ? task.project._id : task.project,
        status: task.status as TaskFormValues["status"],
        priority: task.priority as TaskFormValues["priority"],
        assignedTo: task.assignedTo?._id || undefined,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        projectId: "",
        status: "TODO",
        priority: "MEDIUM",
        assignedTo: undefined,
        dueDate: undefined,
      });
    }
  }, [task, form]);

  const onSubmit = (values: TaskFormValues) => {
    const payload = {
      ...values,
      dueDate: values.dueDate?.toISOString(),
      assignedTo: values.assignedTo || null,
    };

    if (isEditing && task) {
      editTask(
        { taskId: task._id, data: payload },
        {
          onSuccess: () => {
            onClose();
            form.reset();
          },
        }
      );
    } else {
      createTask(payload, {
        onSuccess: () => {
          onClose();
          form.reset();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the task details below"
              : "Fill in the details to create a new task"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description (optional)"
              rows={3}
              {...form.register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project</Label>
              <Select
                value={form.watch("projectId")}
                onValueChange={(value) => form.setValue("projectId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projectsData?.projects?.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.emoji} {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.projectId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.projectId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select
                value={form.watch("assignedTo") || "unassigned"}
                onValueChange={(value) =>
                  form.setValue("assignedTo", value === "unassigned" ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {membersData?.members?.map((member) => (
                    <SelectItem key={member._id} value={member.userId._id}>
                      {member.userId.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue("status", value as TaskFormValues["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TaskStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={form.watch("priority")}
                onValueChange={(value) =>
                  form.setValue("priority", value as TaskFormValues["priority"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TaskPriorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.watch("dueDate") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch("dueDate")
                    ? format(form.watch("dueDate")!, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch("dueDate")}
                  onSelect={(date) => form.setValue("dueDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? "Saving..."
                : isEditing
                ? "Update Task"
                : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
