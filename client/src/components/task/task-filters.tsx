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
  const filters = useTaskFilters();
  const { data: projectsData } = useGetProjectsQuery({
    workspaceId,
    pageSize: 100,
    pageNumber: 1,
  });
  const { data: membersData } = useGetWorkspaceMembers(workspaceId);

  const hasActiveFilters =
    filters.projectId ||
    filters.status ||
    filters.priority ||
    filters.assignedTo ||
    filters.keyword;

  const handleClearFilters = () => {
    filters.setProjectId(undefined);
    filters.setStatus(undefined);
    filters.setPriority(undefined);
    filters.setAssignedTo(undefined);
    filters.setKeyword(undefined);
    filters.setDueDate(undefined);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pb-4">
      <div className="relative flex-1 min-w-[200px] max-w-[300px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          className="pl-9"
          value={filters.keyword || ""}
          onChange={(e) => filters.setKeyword(e.target.value || undefined)}
        />
      </div>

      <Select
        value={filters.projectId || "all"}
        onValueChange={(value) =>
          filters.setProjectId(value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-[160px]">
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
        value={filters.status || "all"}
        onValueChange={(value) =>
          filters.setStatus(value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-[140px]">
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
        value={filters.priority || "all"}
        onValueChange={(value) =>
          filters.setPriority(value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-[130px]">
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
        value={filters.assignedTo || "all"}
        onValueChange={(value) =>
          filters.setAssignedTo(value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-[150px]">
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

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="text-muted-foreground"
        >
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
