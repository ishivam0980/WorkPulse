import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../config/database.config";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import WorkspaceModel from "../models/workspace.model";
import { Roles } from "../enums/role.enum";

const fixMemberRoles = async () => {
  console.log("🔧 Fixing member roles started...");

  try {
    await connectDatabase();

    // Get all roles
    const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });
    const adminRole = await RoleModel.findOne({ name: Roles.ADMIN });
    const memberRole = await RoleModel.findOne({ name: Roles.MEMBER });

    if (!ownerRole || !adminRole || !memberRole) {
      console.error("❌ Roles not found. Please run 'npm run seed' first.");
      process.exit(1);
    }

    console.log("✅ Found roles:");
    console.log(`   OWNER: ${ownerRole._id}`);
    console.log(`   ADMIN: ${adminRole._id}`);
    console.log(`   MEMBER: ${memberRole._id}`);

    // Get all members with invalid or missing role references
    const members = await MemberModel.find({}).populate("role");
    
    let fixed = 0;
    for (const member of members) {
      const hasValidRole = member.role && (member.role as any).name;
      
      if (!hasValidRole) {
        // Check if this member is the owner of the workspace
        const workspace = await WorkspaceModel.findById(member.workspaceId);
        
        if (workspace && workspace.owner.equals(member.userId)) {
          // This is the owner
          member.role = ownerRole._id as any;
          await member.save();
          console.log(`✅ Fixed member ${member._id} -> OWNER role`);
          fixed++;
        } else {
          // Default to MEMBER role
          member.role = memberRole._id as any;
          await member.save();
          console.log(`✅ Fixed member ${member._id} -> MEMBER role`);
          fixed++;
        }
      }
    }

    if (fixed === 0) {
      console.log("✨ All member roles are already valid!");
    } else {
      console.log(`\n✨ Fixed ${fixed} member(s) successfully!`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during fixing:", error);
    process.exit(1);
  }
};

fixMemberRoles().catch((error) =>
  console.error("Error running fix script:", error)
);
