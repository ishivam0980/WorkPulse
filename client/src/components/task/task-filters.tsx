import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { useGetProjectsQuery } from "@/hooks/api/use-project";
import { useGetWorkspaceMembers } from "@/hooks/api/use-member";
import { TaskStatusOptions, TaskPriorityOptions } from "@/constant";

interface TaskFiltersProps {
  workspaceId: string;
}

export function TaskFilters({ workspaceId }: TaskFiltersProps) {
  const { projectId, keyword, priority, status, assignedTo, setFilters, clearFilters } = useTaskFilters();
  const { data: projectsData } = useGetProjectsQuery({
    workspaceId,
    pageSize: 100,
    pageNumber: 1,
  });
  const { data: membersData } = useGetWorkspaceMembers(workspaceId);

  const hasActiveFilters = projectId || status || priority || assignedTo || keyword;

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 pb-4">
      <div className="relative w-full sm:flex-1 sm:min-w-[200px] sm:max-w-[300px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          className="pl-9"
          value={keyword || ""}
          onChange={(e) => setFilters({ keyword: e.target.value || null })}
        />
      </div>

      <div className="grid grid-cols-2 sm:flex gap-2">
        <Select
          value={projectId || "all"}
          onValueChange={(value) => setFilters({ projectId: value === "all" ? null : value })}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projectsData?.projects?.map((project) => (
              <SelectItem key={project._id} value={project._id}>
                {project.emoji} {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={status || "all"}
          onValueChange={(value) => setFilters({ status: value === "all" ? null : value })}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {TaskStatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priority || "all"}
          onValueChange={(value) => setFilters({ priority: value === "all" ? null : value })}
        >
          <SelectTrigger className="w-full sm:w-[130px]">
            <SelectValue placeholder="All Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            {TaskPriorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={assignedTo || "all"}
          onValueChange={(value) => setFilters({ assignedTo: value === "all" ? null : value })}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="All Assignees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            {membersData?.members?.map((member) => (
              <SelectItem key={member._id} value={member.userId._id}>
                {member.userId.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground w-full sm:w-auto"
        >
          <X className="mr-1 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
