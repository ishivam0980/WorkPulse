import mongoose from "mongoose";
import UserModel from "../models/user.model";
import { NotFoundException } from "../utils/appError";

export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findById(userId)
    .populate("currentWorkspace")
    .select("-password");

  if (!user) {
    throw new NotFoundException("User not found");
  }

  return { user };
};

export const updateCurrentUserService = async (
  userId: string,
  data: { name?: string }
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (data.name) {
    user.name = data.name;
  }

  await user.save();

  return { user };
};

export const updateCurrentWorkspaceService = async (
  userId: string,
  workspaceId: string
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  user.currentWorkspace = new mongoose.Types.ObjectId(workspaceId);
  await user.save();

  return { user };
};
