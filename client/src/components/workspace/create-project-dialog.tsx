import { useState } from "react";
import { useParams } from "react-router-dom";
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

import { useCreateProjectDialog } from "@/hooks/use-create-project-dialog";
import { useCreateProjectMutation } from "@/hooks/api/use-project";

const emojis = ["📁", "🚀", "💡", "🎯", "📊", "🔧", "📱", "🌐", "🎨", "📈"];

const CreateProjectDialog = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { isOpen, onClose } = useCreateProjectDialog();
  const { mutate: createProject, isPending } = useCreateProjectMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("📁");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    createProject(
      {
        workspaceId: workspaceId!,
        data: { name, description, emoji },
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully!");
          setName("");
          setDescription("");
          setEmoji("📁");
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to create project");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create a new project to organize your tasks
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
              <Label htmlFor="project-name">Name</Label>
              <Input
                id="project-name"
                placeholder="My Project"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Description (optional)</Label>
              <Textarea
                id="project-description"
                placeholder="Describe your project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
