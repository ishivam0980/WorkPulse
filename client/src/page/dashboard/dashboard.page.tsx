import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarChart3, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/context/auth-provider";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspaceAnalyticsQuery } from "@/hooks/api/use-workspace";
import { useGetProjectsQuery } from "@/hooks/api/use-project";
import { PageLoader } from "@/components/skeleton-loaders/page-loader";

const DashboardPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ workspaceId: string }>();
  const { user } = useAuthContext();
  const { setWorkspaceId } = useWorkspaceId();

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

  if (isAnalyticsLoading || isProjectsLoading) {
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
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || "User"}! Here's an overview of your workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projectsData?.projects && projectsData.projects.length > 0 ? (
              <div className="space-y-4">
                {projectsData.projects.map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() =>
                      navigate(`/workspace/${workspaceId}/project/${project._id}`)
                    }
                  >
                    <div className="text-2xl">{project.emoji || "📁"}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{project.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {project.description || "No description"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">
                No projects yet. Create your first project to get started!
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              onClick={() => navigate(`/workspace/${workspaceId}/tasks`)}
            >
              <p className="font-medium">View All Tasks</p>
              <p className="text-sm text-muted-foreground">
                Manage and track your team's tasks
              </p>
            </div>
            <div
              className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              onClick={() => navigate(`/workspace/${workspaceId}/members`)}
            >
              <p className="font-medium">Team Members</p>
              <p className="text-sm text-muted-foreground">
                View and manage workspace members
              </p>
            </div>
            <div
              className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              onClick={() => navigate(`/workspace/${workspaceId}/settings`)}
            >
              <p className="font-medium">Workspace Settings</p>
              <p className="text-sm text-muted-foreground">
                Configure your workspace preferences
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
