import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { useDeleteTaskMutation } from "@/hooks/api/use-task";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { getAvatarColor, getAvatarFallbackText, Permissions } from "@/constant";
import { usePermissions } from "@/hooks/use-permissions";
import { TaskType } from "@/types/api.type";

interface TaskTableProps {
  tasks: TaskType[];
  workspaceId: string;
}

const statusColors: Record<string, string> = {
  BACKLOG: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  TODO: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  IN_PROGRESS: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  IN_REVIEW: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  DONE: "bg-green-500/10 text-green-500 border-green-500/20",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-green-500/10 text-green-500 border-green-500/20",
  MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  HIGH: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function TaskTable({ tasks, workspaceId }: TaskTableProps) {
  const { onOpen } = useCreateTaskDialog();
  const { hasPermission } = usePermissions(workspaceId);
  const { confirm, isOpen, handleConfirm, handleCancel } = useConfirmDialog();
  const { mutate: deleteTask } = useDeleteTaskMutation(workspaceId);

  const handleEdit = (task: TaskType) => {
    onOpen(task);
  };

  const handleDelete = async (task: TaskType) => {
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

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        No tasks found. Create your first task to get started!
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Task</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const assignee = task.assignedTo;
            const initials = assignee ? getAvatarFallbackText(assignee.name) : "";
            const avatarColor = initials ? getAvatarColor(initials) : "";

            return (
              <TableRow key={task._id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {task.project && (
                    <span className="flex items-center gap-1">
                      <span>{task.project.emoji}</span>
                      <span className="text-sm">{task.project.name}</span>
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={assignee.profilePicture || undefined} />
                        <AvatarFallback
                          style={{ backgroundColor: avatarColor }}
                          className="text-xs"
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[task.status]}>
                    {task.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={priorityColors[task.priority]}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.dueDate ? (
                    <span className="text-sm">
                      {format(new Date(task.dueDate), "MMM d, yyyy")}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">No date</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
