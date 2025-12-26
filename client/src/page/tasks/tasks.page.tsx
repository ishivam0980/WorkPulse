import { useParams } from "react-router-dom";
import { Plus, LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateTaskDialog } from "@/hooks/use-task-dialog";
import { useTaskTableView } from "@/hooks/use-task-table-view";
import { PageLoader } from "@/components/skeleton-loaders/page-loader";
import { useGetTasksQuery } from "@/hooks/api/use-task";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { Permissions } from "@/constant";
import { WithPermission } from "@/hoc/with-permission";

const TasksPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { onOpen: openCreateTask } = useCreateTaskDialog();
  const { view, setView, pageNumber, pageSize } = useTaskTableView();
  const filters = useTaskFilters();

  const { data, isLoading } = useGetTasksQuery({
    workspaceId: workspaceId!,
    projectId: filters.projectId,
    status: filters.status,
    priority: filters.priority,
    assignedTo: filters.assignedTo,
    keyword: filters.keyword,
    dueDate: filters.dueDate,
    pageNumber,
    pageSize,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track all tasks in your workspace
          </p>
        </div>
        <WithPermission permission={Permissions.CREATE_TASK} workspaceId={workspaceId!}>
          <Button onClick={openCreateTask}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </WithPermission>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as "table" | "kanban")}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="table">
              <List className="mr-2 h-4 w-4" />
              Table
            </TabsTrigger>
            <TabsTrigger value="kanban">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Kanban
            </TabsTrigger>
          </TabsList>
          <p className="text-sm text-muted-foreground">
            {data?.pagination?.totalCount || 0} tasks
          </p>
        </div>

        <TabsContent value="table" className="mt-4">
          <div className="rounded-lg border bg-card">
            {data?.tasks && data.tasks.length > 0 ? (
              <div className="divide-y">
                {data.tasks.map((task) => (
                  <div key={task._id} className="flex items-center gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.project?.emoji} {task.project?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.status === "DONE" 
                          ? "bg-green-500/10 text-green-500"
                          : task.status === "IN_PROGRESS"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-gray-500/10 text-gray-500"
                      }`}>
                        {task.status.replace("_", " ")}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === "HIGH" 
                          ? "bg-red-500/10 text-red-500"
                          : task.priority === "MEDIUM"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-green-500/10 text-green-500"
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No tasks found. Create your first task to get started!
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="kanban" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"].map((status) => (
              <div key={status} className="rounded-lg border bg-muted/50 p-4">
                <h3 className="font-medium mb-4">{status.replace("_", " ")}</h3>
                <div className="space-y-2">
                  {data?.tasks
                    ?.filter((t) => t.status === status)
                    .map((task) => (
                      <div key={task._id} className="rounded-lg bg-card p-3 shadow-sm">
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {task.project?.emoji} {task.project?.name}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksPage;
