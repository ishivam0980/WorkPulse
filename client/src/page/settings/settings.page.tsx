import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useGetWorkspaceQuery,
  useEditWorkspaceMutation,
  useDeleteWorkspaceMutation,
} from "@/hooks/api/use-workspace";
import { PageLoader } from "@/components/skeleton-loaders/page-loader";
import { Permissions } from "@/constant";
import { usePermissions } from "@/hooks/use-permissions";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { hasPermission } = usePermissions(workspaceId!);
  const confirmDialog = useConfirmDialog();

  const { data, isLoading } = useGetWorkspaceQuery(workspaceId!);
  const { mutate: editWorkspace, isPending: isEditing } = useEditWorkspaceMutation(workspaceId!);
  const { mutate: deleteWorkspace, isPending: isDeleting } = useDeleteWorkspaceMutation(workspaceId!);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useState(() => {
    if (data?.workspace) {
      setName(data.workspace.name);
      setDescription(data.workspace.description || "");
    }
  });

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Workspace name is required");
      return;
    }
    editWorkspace(
      { workspaceId: workspaceId!, data: { name, description } },
      {
        onSuccess: () => toast.success("Workspace updated successfully"),
        onError: (error: any) => toast.error(error?.message || "Failed to update workspace"),
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

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your workspace settings and preferences
        </p>
      </div>

      {hasPermission(Permissions.EDIT_WORKSPACE) && (
        <Card>
          <CardHeader>
            <CardTitle>Workspace Details</CardTitle>
            <CardDescription>
              Update your workspace information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workspace Name</Label>
              <Input
                id="name"
                value={name || data?.workspace?.name || ""}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Workspace"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description || data?.workspace?.description || ""}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your workspace..."
                rows={3}
              />
            </div>
            <Button onClick={handleSave} disabled={isEditing}>
              {isEditing && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      )}

      {hasPermission(Permissions.DELETE_WORKSPACE) && (
        <>
          <Separator />
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10">
                <div>
                  <p className="font-medium">Delete Workspace</p>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone. All projects, tasks, and data will be permanently deleted.
                  </p>
                </div>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={confirmDialog.isOpen} onOpenChange={() => confirmDialog.onCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your workspace
              and remove all associated data including projects, tasks, and members.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={confirmDialog.onCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDialog.onConfirm}>
              Delete Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
