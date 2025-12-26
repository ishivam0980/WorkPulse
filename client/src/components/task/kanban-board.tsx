import { format } from "date-fns";
import { Calendar, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateTaskDialog } from "@/hooks/use-task-dialog";
import { useDeleteTaskMutation } from "@/hooks/api/use-task";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { getAvatarColor, getAvatarFallbackText, Permissions } from "@/constant";
import { usePermissions } from "@/hooks/use-permissions";
import { TaskType } from "@/types/api.type";

interface KanbanBoardProps {
  tasks: TaskType[];
  workspaceId: string;
}

const columns = [
  { id: "BACKLOG", title: "Backlog", color: "bg-gray-500" },
  { id: "TODO", title: "To Do", color: "bg-blue-500" },
  { id: "IN_PROGRESS", title: "In Progress", color: "bg-purple-500" },
  { id: "IN_REVIEW", title: "In Review", color: "bg-yellow-500" },
  { id: "DONE", title: "Done", color: "bg-green-500" },
];

const priorityColors: Record<string, string> = {
  LOW: "bg-green-500/10 text-green-600",
  MEDIUM: "bg-yellow-500/10 text-yellow-600",
  HIGH: "bg-red-500/10 text-red-600",
};

interface TaskCardProps {
  task: TaskType;
  workspaceId: string;
}

function TaskCard({ task, workspaceId }: TaskCardProps) {
  const { onOpen } = useCreateTaskDialog();
  const { hasPermission } = usePermissions(workspaceId);
  const { confirm } = useConfirmDialog();
  const { mutate: deleteTask } = useDeleteTaskMutation(workspaceId);

  const assignee = task.assignedTo;
  const initials = assignee ? getAvatarFallbackText(assignee.name) : "";
  const avatarColor = initials ? getAvatarColor(initials) : "";

  const handleEdit = () => {
    onOpen(task);
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete Task",
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
    });

    if (confirmed) {
      deleteTask(task._id, {
        onSuccess: () => toast.success("Task deleted successfully"),
        onError: (error: any) => toast.error(error?.message || "Failed to delete task"),
      });
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm line-clamp-2">{task.title}</p>
            {task.project && (
              <p className="text-xs text-muted-foreground mt-1">
                {task.project.emoji} {task.project.name}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {hasPermission(Permissions.EDIT_TASK) && (
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {hasPermission(Permissions.DELETE_TASK) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={`text-xs ${priorityColors[task.priority]}`}>
              {task.priority}
            </Badge>
            {task.dueDate && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(new Date(task.dueDate), "MMM d")}
              </span>
            )}
          </div>
          {assignee && (
            <Avatar className="h-5 w-5">
              <AvatarImage src={assignee.profilePicture || undefined} />
              <AvatarFallback
                style={{ backgroundColor: avatarColor }}
                className="text-[10px]"
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function KanbanBoard({ tasks, workspaceId }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);

        return (
          <div key={column.id} className="flex flex-col rounded-lg bg-muted/50 min-h-[400px]">
            <div className="flex items-center gap-2 p-3 border-b">
              <div className={`w-2 h-2 rounded-full ${column.color}`} />
              <h3 className="font-medium text-sm">{column.title}</h3>
              <span className="text-xs text-muted-foreground ml-auto">
                {columnTasks.length}
              </span>
            </div>
            <ScrollArea className="flex-1 p-2">
              <div className="space-y-2">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <TaskCard key={task._id} task={task} workspaceId={workspaceId} />
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    No tasks
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
}
