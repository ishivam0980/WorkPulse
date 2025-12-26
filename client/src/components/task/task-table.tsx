import { CheckSquare, MoreHorizontal, Pencil, Trash2, Calendar } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
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
import { EmptyState } from "@/components/reusable/empty-state";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { confirm } = useConfirmDialog();
  const { mutate: deleteTask } = useDeleteTaskMutation(workspaceId);
  const isMobile = useIsMobile();

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
      <div className="rounded-lg border bg-card">
        <EmptyState
          icon={<CheckSquare className="h-10 w-10 text-muted-foreground" />}
          title="No tasks yet"
          description="Create your first task to start tracking your work and boost productivity."
          action={
            hasPermission(Permissions.CREATE_TASK) ? (
              <Button onClick={() => onOpen()}>Create Task</Button>
            ) : undefined
          }
        />
      </div>
    );
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <div className="space-y-3">
        {tasks.map((task) => {
          const assignee = task.assignedTo;
          const initials = assignee ? getAvatarFallbackText(assignee.name) : "";
          const avatarColor = initials ? getAvatarColor(initials) : "";

          return (
            <Card key={task._id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{task.title}</p>
                    {task.project && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {task.project.emoji} {task.project.name}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
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

                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className={statusColors[task.status]}>
                    {task.status.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline" className={priorityColors[task.priority]}>
                    {task.priority}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    {assignee ? (
                      <>
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={assignee.profilePicture || undefined} />
                          <AvatarFallback
                            style={{ backgroundColor: avatarColor }}
                            className="text-[10px]"
                          >
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{assignee.name}</span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(task.dueDate), "MMM d")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Desktop Table View
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
