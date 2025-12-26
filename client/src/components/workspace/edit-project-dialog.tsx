import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useEditProjectMutation, useDeleteProjectMutation } from "@/hooks/api/use-project";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { ProjectType } from "@/types/api.type";
import { create } from "zustand";

const emojis = ["📁", "🚀", "💡", "🎯", "📊", "🔧", "📱", "🌐", "🎨", "📈", "⚡", "🔥", "✨", "🏆", "💼"];

type EditProjectDialogState = {
  isOpen: boolean;
  project: ProjectType | null;
  onOpen: (project: ProjectType) => void;
  onClose: () => void;
};

export const useEditProjectDialog = create<EditProjectDialogState>((set) => ({
  isOpen: false,
  project: null,
  onOpen: (project) => set({ isOpen: true, project }),
  onClose: () => set({ isOpen: false, project: null }),
}));

interface EditProjectDialogProps {
  workspaceId: string;
}

export const EditProjectDialog = ({ workspaceId }: EditProjectDialogProps) => {
  const { isOpen, onClose, project } = useEditProjectDialog();
  const { mutate: editProject, isPending: isEditing } = useEditProjectMutation();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProjectMutation();
  const { confirm } = useConfirmDialog();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("📁");

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || "");
      setEmoji(project.emoji || "📁");
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!project) return;

    editProject(
      {
        workspaceId,
        projectId: project._id,
        data: { name, description, emoji },
      },
      {
        onSuccess: () => {
          toast.success("Project updated successfully!");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to update project");
        },
      }
    );
  };

  const handleDelete = async () => {
    if (!project) return;

    const confirmed = await confirm({
      title: "Delete Project",
      message: `Are you sure you want to delete "${project.name}"? All tasks in this project will also be deleted. This action cannot be undone.`,
    });

    if (confirmed) {
      deleteProject(
        { workspaceId, projectId: project._id },
        {
          onSuccess: () => {
            toast.success("Project deleted successfully!");
            onClose();
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to delete project");
          },
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update project details or delete this project
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Emoji</Label>
              <div className="flex flex-wrap gap-2">
                {emojis.map((e) => (
                  <button
                    key={e}
                    type="button"
                    className={`p-2 rounded-lg text-xl hover:bg-muted transition-colors ${
                      emoji === e ? "bg-primary/10 ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setEmoji(e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-project-name">Name</Label>
              <Input
                id="edit-project-name"
                placeholder="My Project"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-project-description">Description (optional)</Label>
              <Textarea
                id="edit-project-description"
                placeholder="Describe your project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isEditing || isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Project"
              )}
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isEditing || isDeleting}>
                {isEditing ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
