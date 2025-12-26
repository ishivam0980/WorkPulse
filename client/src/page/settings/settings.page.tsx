import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Building2, Loader, Settings, Trash2, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useGetWorkspaceQuery,
  useEditWorkspaceMutation,
  useDeleteWorkspaceMutation,
} from "@/hooks/api/use-workspace";
import { useUpdateCurrentUser } from "@/hooks/api/use-user";
import { PageLoader } from "@/components/skeleton-loaders/page-loader";
import { getAvatarColor, getAvatarFallbackText, Permissions } from "@/constant";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuthContext } from "@/context/auth-provider";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { hasPermission } = usePermissions(workspaceId!);
  const { user } = useAuthContext();
  const confirmDialog = useConfirmDialog();

  // Workspace state
  const { data, isLoading } = useGetWorkspaceQuery(workspaceId!);
  const { mutate: editWorkspace, isPending: isEditing } = useEditWorkspaceMutation(workspaceId!);
  const { mutate: deleteWorkspace, isPending: isDeleting } = useDeleteWorkspaceMutation(workspaceId!);
  const { mutate: updateUser, isPending: isUpdatingProfile } = useUpdateCurrentUser();

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (data?.workspace) {
      setWorkspaceName(data.workspace.name);
      setWorkspaceDescription(data.workspace.description || "");
    }
  }, [data?.workspace]);

  useEffect(() => {
    if (user) {
      setUserName(user.name);
    }
  }, [user]);

  const handleSaveWorkspace = () => {
    if (!workspaceName.trim()) {
      toast.error("Workspace name is required");
      return;
    }
    editWorkspace(
      { workspaceId: workspaceId!, data: { name: workspaceName, description: workspaceDescription } },
      {
        onSuccess: () => toast.success("Workspace updated successfully"),
        onError: (error: any) => toast.error(error?.message || "Failed to update workspace"),
      }
    );
  };

  const handleSaveProfile = () => {
    if (!userName.trim()) {
      toast.error("Name is required");
      return;
    }
    updateUser(
      { name: userName },
      {
        onSuccess: () => toast.success("Profile updated successfully"),
        onError: (error: any) => toast.error(error?.message || "Failed to update profile"),
      }
    );
  };

  const handleDelete = async () => {
    const confirmed = await confirmDialog.confirm();
    if (confirmed) {
      deleteWorkspace(undefined, {
        onSuccess: (data) => {
          toast.success("Workspace deleted successfully");
          navigate(`/workspace/${data.currentWorkspace}`);
        },
        onError: (error: any) => toast.error(error?.message || "Failed to delete workspace"),
      });
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  const userInitials = getAvatarFallbackText(user?.name || "");
  const userAvatarColor = getAvatarColor(userInitials);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your workspace and profile settings
          </p>
        </div>
      </div>

      <Tabs defaultValue="workspace" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="workspace" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Workspace
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        {/* Workspace Settings Tab */}
        <TabsContent value="workspace" className="space-y-6 max-w-2xl">
          {hasPermission(Permissions.EDIT_WORKSPACE) ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Workspace Details
                </CardTitle>
                <CardDescription>
                  Update your workspace information and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workspaceName">Workspace Name</Label>
                  <Input
                    id="workspaceName"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="My Workspace"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workspaceDescription">Description</Label>
                  <Textarea
                    id="workspaceDescription"
                    value={workspaceDescription}
                    onChange={(e) => setWorkspaceDescription(e.target.value)}
                    placeholder="Describe what this workspace is for..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleSaveWorkspace} disabled={isEditing}>
                  {isEditing && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Save Workspace
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Workspace Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Workspace Name</p>
                  <p className="font-medium">{data?.workspace?.name}</p>
                </div>
                {data?.workspace?.description && (
                  <div className="space-y-2 mt-4">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p>{data.workspace.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {hasPermission(Permissions.DELETE_WORKSPACE) && (
            <>
              <Separator />
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-destructive/10">
                    <div>
                      <p className="font-medium">Delete this Workspace</p>
                      <p className="text-sm text-muted-foreground">
                        All projects, tasks, and data will be permanently deleted. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="shrink-0">
                      {isDeleting ? (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Delete Workspace
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Profile Settings Tab */}
        <TabsContent value="profile" className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Profile
              </CardTitle>
              <CardDescription>
                Manage your personal account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-background shadow-md">
                  <AvatarImage src={user?.profilePicture || undefined} />
                  <AvatarFallback style={{ backgroundColor: userAvatarColor }} className="text-lg font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Display Name</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your name"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is how your name will appear across all workspaces
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                <Button onClick={handleSaveProfile} disabled={isUpdatingProfile}>
                  {isUpdatingProfile && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Details about your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Account Created</p>
                  <p className="font-medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={() => confirmDialog.handleCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Workspace
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your workspace
              and remove all associated data including projects, tasks, and members.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={confirmDialog.handleCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDialog.handleConfirm}>
              Yes, Delete Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
