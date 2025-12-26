import { TaskPriorityEnum, TaskStatusEnum } from "@/types/api.type";

export const TaskStatusOptions = [
  { label: "Backlog", value: TaskStatusEnum.BACKLOG },
  { label: "To Do", value: TaskStatusEnum.TODO },
  { label: "In Progress", value: TaskStatusEnum.IN_PROGRESS },
  { label: "In Review", value: TaskStatusEnum.IN_REVIEW },
  { label: "Done", value: TaskStatusEnum.DONE },
];

export const TaskPriorityOptions = [
  { label: "Low", value: TaskPriorityEnum.LOW },
  { label: "Medium", value: TaskPriorityEnum.MEDIUM },
  { label: "High", value: TaskPriorityEnum.HIGH },
];

export const transformOptions = (
  options: { label: string; value: string }[]
) => {
  return options.map((opt) => ({
    label: opt.label,
    value: opt.value,
  }));
};

export const getAvatarColor = (initials: string): string => {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
    "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
    "#BB8FCE", "#85C1E9", "#F8B500", "#00CED1",
  ];

  const charCode = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  return colors[charCode % colors.length];
};

export const getAvatarFallbackText = (name: string): string => {
  if (!name) return "WP";
  const words = name.trim().split(" ");
  const initials = words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  return initials || "WP";
};

export const Permissions = {
  CREATE_WORKSPACE: "CREATE_WORKSPACE",
  DELETE_WORKSPACE: "DELETE_WORKSPACE",
  EDIT_WORKSPACE: "EDIT_WORKSPACE",
  MANAGE_WORKSPACE_SETTINGS: "MANAGE_WORKSPACE_SETTINGS",
  ADD_MEMBER: "ADD_MEMBER",
  CHANGE_MEMBER_ROLE: "CHANGE_MEMBER_ROLE",
  REMOVE_MEMBER: "REMOVE_MEMBER",
  CREATE_PROJECT: "CREATE_PROJECT",
  EDIT_PROJECT: "EDIT_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT",
  CREATE_TASK: "CREATE_TASK",
  EDIT_TASK: "EDIT_TASK",
  DELETE_TASK: "DELETE_TASK",
  VIEW_ONLY: "VIEW_ONLY",
} as const;

export type PermissionType = keyof typeof Permissions;
