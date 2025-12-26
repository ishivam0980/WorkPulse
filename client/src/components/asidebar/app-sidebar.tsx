import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Home,
  ListTodo,
  Users,
  Settings,
  FolderKanban,
  Plus,
  ChevronDown,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

import Logo from "@/components/logo";
import { useAuthContext } from "@/context/auth-provider";
import { useGetAllWorkspacesQuery } from "@/hooks/api/use-workspace";
import { useGetProjectsQuery } from "@/hooks/api/use-project";
import { useCreateWorkspaceDialog } from "@/hooks/use-create-workspace-dialog";
import { useCreateProjectDialog } from "@/hooks/use-create-project-dialog";
import { getAvatarColor, getAvatarFallbackText, Permissions } from "@/constant";
import { usePermissions } from "@/hooks/use-permissions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutMutationFn } from "@/hooks/api/auth-api";
import { toast } from "sonner";

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { isMobile, setOpenMobile } = useSidebar();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const { data: workspacesData } = useGetAllWorkspacesQuery();
  const { data: projectsData } = useGetProjectsQuery({ workspaceId: workspaceId! });
  const { hasPermission } = usePermissions(workspaceId || "");

  const { onOpen: openCreateWorkspace } = useCreateWorkspaceDialog();
  const { onOpen: openCreateProject } = useCreateProjectDialog();

  const { mutate: logout } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      queryClient.clear();
      navigate("/");
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });

  const currentWorkspace = workspacesData?.workspaces?.find(
    (w) => w._id === workspaceId
  );

  const navItems = [
    {
      title: "Dashboard",
      url: `/workspace/${workspaceId}`,
      icon: Home,
    },
    {
      title: "Tasks",
      url: `/workspace/${workspaceId}/tasks`,
      icon: ListTodo,
    },
    {
      title: "Members",
      url: `/workspace/${workspaceId}/members`,
      icon: Users,
    },
    {
      title: "Settings",
      url: `/workspace/${workspaceId}/settings`,
      icon: Settings,
    },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const userInitials = getAvatarFallbackText(user?.name || "");
  const userAvatarColor = getAvatarColor(userInitials);

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="p-2">
          <Logo url={`/workspace/${workspaceId}`} />
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                      {currentWorkspace?.name?.charAt(0).toUpperCase() || "W"}
                    </div>
                    <span className="truncate font-medium">
                      {currentWorkspace?.name || "Select Workspace"}
                    </span>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {workspacesData?.workspaces?.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace._id}
                    onClick={() => {
                      navigate(`/workspace/${workspace._id}`);
                      handleNavClick();
                    }}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary text-xs font-medium mr-2">
                      {workspace.name.charAt(0).toUpperCase()}
                    </div>
                    {workspace.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={openCreateWorkspace}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                    >
                      <Link to={item.url} onClick={handleNavClick}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            {hasPermission(Permissions.CREATE_PROJECT) && (
              <SidebarGroupAction onClick={openCreateProject} title="Create Project">
                <Plus className="h-4 w-4" />
              </SidebarGroupAction>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {projectsData?.projects?.map((project) => (
                  <SidebarMenuItem key={project._id}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.includes(project._id)}
                    >
                      <Link
                        to={`/workspace/${workspaceId}/project/${project._id}`}
                        onClick={handleNavClick}
                      >
                        <span>{project.emoji || "📁"}</span>
                        <span className="truncate">{project.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {(!projectsData?.projects || projectsData.projects.length === 0) && (
                  <p className="px-2 py-1 text-xs text-muted-foreground">
                    No projects yet
                  </p>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.profilePicture || undefined} />
                    <AvatarFallback style={{ backgroundColor: userAvatarColor }}>
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate font-medium">{user?.name}</span>
                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
