import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FolderOpen, CheckSquare, Loader, Command } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchDialog } from "@/hooks/use-search-dialog";
import { useGetProjectsQuery } from "@/hooks/api/use-project";
import { useGetTasksQuery } from "@/hooks/api/use-task";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchDialogProps {
  workspaceId: string;
}

const statusColors: Record<string, string> = {
  BACKLOG: "bg-gray-500/10 text-gray-500",
  TODO: "bg-blue-500/10 text-blue-500",
  IN_PROGRESS: "bg-purple-500/10 text-purple-500",
  IN_REVIEW: "bg-yellow-500/10 text-yellow-500",
  DONE: "bg-green-500/10 text-green-500",
};

export function SearchDialog({ workspaceId }: SearchDialogProps) {
  const navigate = useNavigate();
  const { isOpen, onClose } = useSearchDialog();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  // Fetch projects
  const { data: projectsData, isLoading: isProjectsLoading } = useGetProjectsQuery({
    workspaceId,
    pageSize: 50,
    pageNumber: 1,
  });

  // Fetch tasks with search
  const { data: tasksData, isLoading: isTasksLoading } = useGetTasksQuery({
    workspaceId,
    keyword: debouncedQuery || undefined,
    pageSize: 20,
    pageNumber: 1,
  });

  const isLoading = isProjectsLoading || isTasksLoading;

  // Filter projects by query
  const filteredProjects = projectsData?.projects?.filter((project) =>
    project.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  ) || [];

  const tasks = tasksData?.tasks || [];

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        useSearchDialog.getState().toggle();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback(
    (type: "project" | "task", id: string) => {
      if (type === "project") {
        navigate(`/workspace/${workspaceId}/project/${id}`);
      } else {
        navigate(`/workspace/${workspaceId}/tasks`);
      }
      onClose();
      setQuery("");
    },
    [navigate, workspaceId, onClose]
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setQuery("");
    }
  };

  const hasResults = filteredProjects.length > 0 || tasks.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks and projects..."
              className="pl-10 pr-4 border-none shadow-none focus-visible:ring-0 text-base"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[400px]">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && !query && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <p>Start typing to search tasks and projects</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                  <Command className="h-3 w-3" />K
                </kbd>
                <span>to open search</span>
              </div>
            </div>
          )}

          {!isLoading && query && !hasResults && (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No results found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}

          {!isLoading && hasResults && (
            <div className="p-2">
              {filteredProjects.length > 0 && (
                <div className="mb-4">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                    Projects
                  </div>
                  {filteredProjects.slice(0, 5).map((project) => (
                    <button
                      key={project._id}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted transition-colors text-left"
                      onClick={() => handleSelect("project", project._id)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-lg">
                        {project.emoji || "📁"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{project.name}</p>
                        {project.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {tasks.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                    Tasks
                  </div>
                  {tasks.slice(0, 8).map((task) => (
                    <button
                      key={task._id}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted transition-colors text-left"
                      onClick={() => handleSelect("task", task._id)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        <CheckSquare className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{task.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {task.project?.emoji} {task.project?.name}
                        </p>
                      </div>
                      <Badge variant="secondary" className={`text-xs shrink-0 ${statusColors[task.status]}`}>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                ↑↓
              </kbd>
              <span>to navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                ↵
              </kbd>
              <span>to select</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              esc
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchDialog;
