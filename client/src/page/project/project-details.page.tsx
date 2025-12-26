import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, BarChart3, CheckCircle2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetProjectQuery, useGetProjectAnalyticsQuery } from "@/hooks/api/use-project";
import { useCreateTaskDialog } from "@/hooks/use-task-dialog";
import { PageLoader } from "@/components/skeleton-loaders/page-loader";
import { Permissions } from "@/constant";
import { WithPermission } from "@/hoc/with-permission";
import { ProjectTasksList } from "@/components/task/project-tasks-list";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";

const ProjectDetailsPage = () => {
  const navigate = useNavigate();
  const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId: string }>();
  const { onOpen: openCreateTask } = useCreateTaskDialog();

  const { data: projectData, isLoading: isProjectLoading } = useGetProjectQuery({
    workspaceId: workspaceId!,
    projectId: projectId!,
  });

  const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetProjectAnalyticsQuery({
    workspaceId: workspaceId!,
    projectId: projectId!,
  });

  if (isProjectLoading || isAnalyticsLoading) {
    return <PageLoader />;
  }

  const project = projectData?.project;
  const analytics = analyticsData?.analytics;

  const stats = [
    {
      title: "Total Tasks",
      value: analytics?.totalTasks || 0,
      icon: BarChart3,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Completed",
      value: analytics?.completedTasks || 0,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Overdue",
      value: analytics?.overdueTasks || 0,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{project?.emoji || "📁"}</span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project?.name}</h1>
            <p className="text-muted-foreground">
              {project?.description || "No description"}
            </p>
          </div>
        </div>
        <div className="ml-auto">
          <WithPermission permission={Permissions.CREATE_TASK} workspaceId={workspaceId!}>
            <Button onClick={() => openCreateTask()}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </WithPermission>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProjectTasksList workspaceId={workspaceId!} projectId={projectId!} />

      <CreateTaskDialog workspaceId={workspaceId!} />
    </div>
  );
};

export default ProjectDetailsPage;
