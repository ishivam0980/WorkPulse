export type UserType = {
  _id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  currentWorkspace: {
    _id: string;
    name: string;
    owner: string;
    inviteCode: string;
  } | null;
};

export type CurrentUserResponseType = {
  message: string;
  user: UserType;
};

export type WorkspaceType = {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  inviteCode: string;
};

export type WorkspaceWithMembersType = WorkspaceType & {
  members: {
    _id: string;
    userId: string;
    workspaceId: string;
    role: {
      _id: string;
      name: string;
    };
    joinedAt: Date;
  }[];
};

export type CreateWorkspaceType = {
  name: string;
  description?: string;
};

export type EditWorkspaceType = {
  name: string;
  description?: string;
};

export type AllWorkspacesResponseType = {
  message: string;
  workspaces: WorkspaceType[];
};

export type CreateWorkspaceResponseType = {
  message: string;
  workspace: WorkspaceType;
};

export type EditWorkspaceResponseType = {
  message: string;
  workspace: WorkspaceType;
};

export type ChangeWorkspaceMemberRoleType = {
  roleId: string;
  memberId: string;
};

export type ProjectType = {
  _id: string;
  name: string;
  emoji?: string;
  description?: string;
  workspace: string;
  createdBy: {
    _id: string;
    name: string;
    profilePicture: string | null;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectPayloadType = {
  emoji?: string;
  name: string;
  description?: string;
};

export type CreateProjectResponseType = {
  message: string;
  project: ProjectType;
};

export type AllProjectPayloadType = {
  workspaceId: string;
  pageNumber?: number;
  pageSize?: number;
};

export type AllProjectResponseType = {
  message: string;
  projects: ProjectType[];
  pagination: {
    totalCount: number;
    pageSize: number;
    pageNumber: number;
    totalPages: number;
    skip: number;
    limit: number;
  };
};

export type ProjectByIdPayloadType = {
  workspaceId: string;
  projectId: string;
};

export type EditProjectPayloadType = ProjectByIdPayloadType & {
  data: {
    emoji?: string;
    name: string;
    description?: string;
  };
};

export type ProjectAnalyticsPayloadType = ProjectByIdPayloadType;

export type ProjectAnalyticsResponseType = {
  message: string;
  analytics: {
    totalTasks: number;
    overdueTasks: number;
    completedTasks: number;
  };
};

export enum TaskStatusEnum {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export enum TaskPriorityEnum {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export type TaskType = {
  _id: string;
  taskCode: string;
  title: string;
  description?: string;
  project: {
    _id: string;
    name: string;
    emoji?: string;
  };
  workspace: string;
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  assignedTo: {
    _id: string;
    name: string;
    profilePicture: string | null;
  } | null;
  createdBy: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type AllTaskPayloadType = {
  workspaceId: string;
  projectId?: string | null;
  keyword?: string | null;
  priority?: string | null;
  status?: string | null;
  assignedTo?: string | null;
  dueDate?: string | null;
  pageNumber?: number;
  pageSize?: number;
};

export type AllTaskResponseType = {
  message: string;
  tasks: TaskType[];
  pagination: {
    totalCount: number;
    pageSize: number;
    pageNumber: number;
    totalPages: number;
    skip: number;
  };
};

export type CreateTaskPayloadType = {
  workspaceId: string;
  projectId: string;
  data: {
    title: string;
    description?: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
    dueDate?: string;
  };
};

export type CreateTaskResponseType = {
  message: string;
  task: TaskType;
};

export type UpdateTaskPayloadType = {
  workspaceId: string;
  projectId: string;
  taskId: string;
  data: {
    title: string;
    description?: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
    dueDate?: string;
  };
};

export type UpdateTaskStatusPayloadType = {
  workspaceId: string;
  projectId: string;
  taskId: string;
  data: {
    status: string;
  };
};

export type DeleteTaskPayloadType = {
  workspaceId: string;
  taskId: string;
};

export type MemberType = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profilePicture: string | null;
  };
  workspaceId: string;
  role: {
    _id: string;
    name: string;
    permissions: string[];
  };
  joinedAt: Date;
};

export type AllMembersInWorkspaceResponseType = {
  message: string;
  members: MemberType[];
  roles: {
    _id: string;
    name: string;
  }[];
};

export type AnalyticsResponseType = {
  message: string;
  analytics: {
    totalTasks: number;
    overdueTasks: number;
    completedTasks: number;
  };
};

export type LoginType = {
  email: string;
  password: string;
};

export type LoginResponseType = {
  message: string;
  user: UserType;
};

export type registerType = {
  name: string;
  email: string;
  password: string;
};
