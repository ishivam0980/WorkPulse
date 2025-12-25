import { v4 as uuidv4 } from "uuid";

export const generateInviteCode = (): string => {
  return uuidv4().replace(/-/g, "").substring(0, 8);
};

export const generateTaskCode = (): string => {
  return `TASK-${uuidv4().replace(/-/g, "").substring(0, 6).toUpperCase()}`;
};
