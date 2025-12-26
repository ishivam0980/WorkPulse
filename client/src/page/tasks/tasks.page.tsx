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
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { TaskFilters } from "@/components/task/task-filters";
import { TaskTable } from "@/components/task/task-table";
import { KanbanBoard } from "@/components/task/kanban-board";

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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage and track all tasks in your workspace
          </p>
        </div>
        <WithPermission permission={Permissions.CREATE_TASK} workspaceId={workspaceId!}>
          <Button onClick={() => openCreateTask()} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </WithPermission>
      </div>

      <TaskFilters workspaceId={workspaceId!} />

      <Tabs value={view} onValueChange={(v) => setView(v as "table" | "kanban")}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="table" className="text-xs sm:text-sm">
              <List className="mr-1.5 sm:mr-2 h-4 w-4" />
              Table
            </TabsTrigger>
            <TabsTrigger value="kanban" className="text-xs sm:text-sm">
              <LayoutGrid className="mr-1.5 sm:mr-2 h-4 w-4" />
              Kanban
            </TabsTrigger>
          </TabsList>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {data?.pagination?.totalCount || 0} tasks
          </p>
        </div>

        <TabsContent value="table" className="mt-4">
          <TaskTable tasks={data?.tasks || []} workspaceId={workspaceId!} />
        </TabsContent>

        <TabsContent value="kanban" className="mt-4">
          <KanbanBoard tasks={data?.tasks || []} workspaceId={workspaceId!} />
        </TabsContent>
      </Tabs>

      <CreateTaskDialog workspaceId={workspaceId!} />
    </div>
  );
};

export default TasksPage;
