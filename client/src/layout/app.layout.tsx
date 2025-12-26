import { Outlet, useParams } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/asidebar/app-sidebar";
import Header from "@/components/header";
import CreateWorkspaceDialog from "@/components/workspace/create-workspace-dialog";
import CreateProjectDialog from "@/components/workspace/create-project-dialog";
import { EditProjectDialog } from "@/components/workspace/edit-project-dialog";
import { SearchDialog } from "@/components/search/search-dialog";

const AppLayout = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>
      <CreateWorkspaceDialog />
      <CreateProjectDialog />
      {workspaceId && <EditProjectDialog workspaceId={workspaceId} />}
      {workspaceId && <SearchDialog workspaceId={workspaceId} />}
    </SidebarProvider>
  );
};

export default AppLayout;
