import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarChart3, CheckCircle2, AlertTriangle, ArrowRight, FolderOpen, Users, Settings, ListTodo, Plus } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/context/auth-provider";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspaceAnalyticsQuery } from "@/hooks/api/use-workspace";
import { useGetProjectsQuery } from "@/hooks/api/use-project";
import { useGetTasksQuery } from "@/hooks/api/use-task";
import { useCreateTaskDialog } from "@/hooks/use-task-dialog";
import { useCreateProjectDialog } from "@/hooks/use-create-project-dialog";
import { PageLoader } from "@/components/skeleton-loaders/page-loader";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Permissions } from "@/constant";
import { WithPermission } from "@/hoc/with-permission";

const statusColors: Record<string, string> = {
  BACKLOG: "bg-gray-500/10 text-gray-500",
  TODO: "bg-blue-500/10 text-blue-500",
  IN_PROGRESS: "bg-purple-500/10 text-purple-500",
  IN_REVIEW: "bg-yellow-500/10 text-yellow-500",
  DONE: "bg-green-500/10 text-green-500",
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ workspaceId: string }>();
  const { user } = useAuthContext();
  const { setWorkspaceId } = useWorkspaceId();
  const { onOpen: openCreateTask } = useCreateTaskDialog();
  const { onOpen: openCreateProject } = useCreateProjectDialog();

  const workspaceId = params.workspaceId!;

  useEffect(() => {
    if (workspaceId) {
      setWorkspaceId(workspaceId);
    }
  }, [workspaceId, setWorkspaceId]);

  useEffect(() => {
    if (user && !workspaceId) {
      if (user.currentWorkspace?._id) {
        navigate(`/workspace/${user.currentWorkspace._id}`);
      }
    }
  }, [user, workspaceId, navigate]);

  const { data: analytics, isLoading: isAnalyticsLoading } =
    useGetWorkspaceAnalyticsQuery(workspaceId);

  const { data: projectsData, isLoading: isProjectsLoading } =
    useGetProjectsQuery({ workspaceId, pageSize: 5, pageNumber: 1 });

  const { data: tasksData, isLoading: isTasksLoading } =
    useGetTasksQuery({
      workspaceId,
      pageSize: 5,
      pageNumber: 1,
    });

  if (isAnalyticsLoading || isProjectsLoading || isTasksLoading) {
    return <PageLoader />;
  }

  const stats = [
    {
      title: "Total Tasks",
      value: analytics?.analytics?.totalTasks || 0,
      icon: BarChart3,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Completed",
      value: analytics?.analytics?.completedTasks || 0,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Overdue",
      value: analytics?.analytics?.overdueTasks || 0,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Projects",
      value: projectsData?.pagination?.totalCount || 0,
      icon: FolderOpen,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  const quickActions = [
    {
      title: "View All Tasks",
      description: "Manage and track your team's tasks",
      icon: ListTodo,
      onClick: () => navigate(`/workspace/${workspaceId}/tasks`),
    },
    {
      title: "Team Members",
      description: "View and manage workspace members",
      icon: Users,
      onClick: () => navigate(`/workspace/${workspaceId}/members`),
    },
    {
      title: "Workspace Settings",
      description: "Configure your workspace preferences",
      icon: Settings,
      onClick: () => navigate(`/workspace/${workspaceId}/settings`),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back, {user?.name || "User"}! Here's an overview of your workspace.
          </p>
        </div>
        <div className="flex gap-2">
          <WithPermission permission={Permissions.CREATE_PROJECT} workspaceId={workspaceId}>
            <Button variant="outline" onClick={openCreateProject} size="sm" className="sm:size-default">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden">Project</span>
            </Button>
          </WithPermission>
          <WithPermission permission={Permissions.CREATE_TASK} workspaceId={workspaceId}>
            <Button onClick={() => openCreateTask()} size="sm" className="sm:size-default">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">Task</span>
            </Button>
          </WithPermission>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 order-2 lg:order-1">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg">Recent Tasks</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your latest tasks across all projects</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/workspace/${workspaceId}/tasks`)}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {tasksData?.tasks && tasksData.tasks.length > 0 ? (
              <div className="space-y-3">
                {tasksData.tasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.project?.emoji} {task.project?.name}
                      </p>
                    </div>
                    <Badge variant="secondary" className={statusColors[task.status]}>
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ListTodo className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tasks yet</p>
                <p className="text-sm">Create your first task to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4 order-1 lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projectsData?.projects && projectsData.projects.length > 0 ? (
                <div className="space-y-3">
                  {projectsData.projects.slice(0, 4).map((project) => (
                    <div
                      key={project._id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() =>
                        navigate(`/workspace/${workspaceId}/project/${project._id}`)
                      }
                    >
                      <div className="text-xl">{project.emoji || "📁"}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">{project.name}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No projects yet
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
                <div
                  key={action.title}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  onClick={action.onClick}
                >
                  <div className="p-2 rounded-lg bg-muted">
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateTaskDialog workspaceId={workspaceId} />
    </div>
  );
};

export default DashboardPage;
