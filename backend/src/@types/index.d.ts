import { UserDocument } from "../models/user.model";

declare global {
  namespace Express {
    interface User {
      _id: string;
      name: string;
      email: string;
      profilePicture: string | null;
      currentWorkspace: string;
    }
  }
}

export {};
