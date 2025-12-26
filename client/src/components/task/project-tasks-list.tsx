import { format } from "date-fns";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateTaskDialog } from "@/hooks/use-task-dialog";
import { useGetTasksQuery, useDeleteTaskMutation } from "@/hooks/api/use-task";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { getAvatarColor, getAvatarFallbackText, Permissions } from "@/constant";
import { usePermissions } from "@/hooks/use-permissions";
import { PageLoader } from "@/components/skeleton-loaders/page-loader";
import { TaskType } from "@/types/api.type";

interface ProjectTasksListProps {
  workspaceId: string;
  projectId: string;
}

const statusColors: Record<string, string> = {
  BACKLOG: "bg-gray-500/10 text-gray-500",
  TODO: "bg-blue-500/10 text-blue-500",
  IN_PROGRESS: "bg-purple-500/10 text-purple-500",
  IN_REVIEW: "bg-yellow-500/10 text-yellow-500",
  DONE: "bg-green-500/10 text-green-500",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-green-500/10 text-green-600",
  MEDIUM: "bg-yellow-500/10 text-yellow-600",
  HIGH: "bg-red-500/10 text-red-600",
};

export function ProjectTasksList({ workspaceId, projectId }: ProjectTasksListProps) {
  const { onOpen } = useCreateTaskDialog();
  const { hasPermission } = usePermissions(workspaceId);
  const { confirm } = useConfirmDialog();
  const { mutate: deleteTask } = useDeleteTaskMutation(workspaceId);

  const { data, isLoading } = useGetTasksQuery({
    workspaceId,
    projectId,
    pageNumber: 1,
    pageSize: 50,
  });

  const handleEdit = (task: TaskType) => {
    onOpen(task);
  };

  const handleDelete = async (task: TaskType) => {
    const confirmed = await confirm({
      title: "Delete Task",
      message: `Are you sure you want to delete "${task.title}"?`,
    });

    if (confirmed) {
      deleteTask(task._id, {
        onSuccess: () => toast.success("Task deleted successfully"),
        onError: (error: any) => toast.error(error?.message || "Failed to delete task"),
      });
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks ({data?.tasks?.length || 0})</CardTitle>
        {hasPermission(Permissions.CREATE_TASK) && (
          <Button size="sm" onClick={() => onOpen()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {data?.tasks && data.tasks.length > 0 ? (
          <div className="space-y-3">
            {data.tasks.map((task) => {
              const assignee = task.assignedTo;
              const initials = assignee ? getAvatarFallbackText(assignee.name) : "";
              const avatarColor = initials ? getAvatarColor(initials) : "";

              return (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={statusColors[task.status]}>
                          {task.status.replace("_", " ")}
                        </Badge>
                        <Badge variant="secondary" className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            Due {format(new Date(task.dueDate), "MMM d")}
                          </span>
                        )}
                      </div>
                    </div>
                    {assignee && (
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={assignee.profilePicture || undefined} />
                        <AvatarFallback
                          style={{ backgroundColor: avatarColor }}
                          className="text-xs"
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {hasPermission(Permissions.EDIT_TASK) && (
                        <DropdownMenuItem onClick={() => handleEdit(task)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {hasPermission(Permissions.DELETE_TASK) && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(task)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No tasks yet. Create your first task to get started!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
